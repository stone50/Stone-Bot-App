const fetch = require('node-fetch')

const setupEvents = async () => {

    //get access tokens
    // const userAccessToken = (await (await fetch(
    //     `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${process.env.TWITCH_REFRESH_TOKEN}`,
    //     {
    //         method: 'post'
    //     }
    // )).json()).access_token

    const appAccessToken = (await (await fetch(
        `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
        {
            method: 'post'
        }
    )).json()).access_token

    // purge event subscriptions
    {
        (await (await fetch(
            'https://api.twitch.tv/helix/eventsub/subscriptions',
            {
                method: 'get',
                headers: {
                    'Authorization': `Bearer ${appAccessToken}`,
                    'Client-Id': `${process.env.TWITCH_CLIENT_ID}`
                }
            }
        )).json()).data.forEach(eventSub => {
            return fetch(
                `https://api.twitch.tv/helix/eventsub/subscriptions?id=${eventSub.id}`,
                {
                    method: 'delete',
                    headers: {
                        Authorization: `Bearer ${appAccessToken}`,
                        'Client-Id': process.env.TWITCH_CLIENT_ID
                    }
                }
            )
        })
    }

    // create twitch event subscriptions

    // stream online eventsub
    await (await fetch(
        'https://api.twitch.tv/helix/eventsub/subscriptions',
        {
            method: 'post',
            headers: {
                Authorization: `Bearer ${appAccessToken}`,
                'Client-Id': process.env.TWITCH_CLIENT_ID,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: 'stream.online',
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

    // stream offline eventsub
    await (await fetch(
        'https://api.twitch.tv/helix/eventsub/subscriptions',
        {
            method: 'post',
            headers: {
                Authorization: `Bearer ${appAccessToken}`,
                'Client-Id': process.env.TWITCH_CLIENT_ID,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: 'stream.offline',
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
}

module.exports = setupEvents