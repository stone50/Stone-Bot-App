const fetch = require('node-fetch')

const { botLog } = require('../api')

const badResStatus = res => {
    return res.status >= 300 || res.status < 200
}

const badResStatusMessage = resJson => {
    return `${resJson.status}: ${resJson.message || resJson.error}`
}

let appAccessToken = null

const createEventSub = async (eventName) => {
    botLog('info', `creating ${eventName} twitch event subscription`)
    const eventResponse = await (await fetch(
        'https://api.twitch.tv/helix/eventsub/subscriptions',
        {
            method: 'post',
            headers: {
                Authorization: `Bearer ${appAccessToken}`,
                'Client-Id': process.env.TWITCH_CLIENT_ID,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: `stream.${eventName}`,
                version: '1',
                condition: {
                    broadcaster_user_id: process.env.TWITCH_USER_ID
                },
                transport: {
                    method: 'webhook',
                    callback: process.env.SERVER_URL,
                    secret: process.env.TWITCH_CLIENT_SECRET
                }
            })
        }
    )).json()

    if (badResStatus(eventResponse)) {
        const errMessage = `${eventName} event subscription failed with status ${badResStatusMessage(eventResponse)}`
        if (eventResponse.message !== 'subscription already exists') {
            throw errMessage
        }
        botLog('warn', errMessage)
    }
}

const setupEvents = async () => {

    botLog('info', 'setting up twitch event subscriptions')

    // const userAccessToken = (await (await fetch(
    //     `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${process.env.TWITCH_REFRESH_TOKEN}`,
    //     {
    //         method: 'post'
    //     }
    // )).json()).access_token

    botLog('info', 'fetching app access token from twitch')

    const tokenFetchResponse = await (await fetch(
        `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
        {
            method: 'post'
        }
    )).json()

    if (badResStatus(tokenFetchResponse)) {
        throw `app access token fetch failed with status ${badResStatusMessage(tokenFetchResponse)}`
    }

    appAccessToken = tokenFetchResponse.access_token

    botLog('info', 'deleting existing twitch event subscriptions')

    const eventSubsResponse = await (await fetch(
        'https://api.twitch.tv/helix/eventsub/subscriptions',
        {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${appAccessToken}`,
                'Client-Id': `${process.env.TWITCH_CLIENT_ID}`
            }
        }
    )).json()

    if (badResStatus(eventSubsResponse)) {
        botLog('warn', `event subscriptions fetch failed with status ${badResStatusMessage(eventSubsResponse)}`)
    } else {
        for (const eventSub of eventSubsResponse.data) {
            const eventSubRes = await fetch(
                `https://api.twitch.tv/helix/eventsub/subscriptions?id=${eventSub.id}`,
                {
                    method: 'delete',
                    headers: {
                        Authorization: `Bearer ${appAccessToken}`,
                        'Client-Id': process.env.TWITCH_CLIENT_ID
                    }
                }
            )

            if (badResStatus(eventSubRes)) {
                botLog('warn', `event subscription ${eventSub.id} deletion failed with status ${badResStatusMessage(await eventSubRes.json())}`)
            }
        }
    }

    await createEventSub('online')
    await createEventSub('offline')
}

module.exports = setupEvents