const crypto = require('crypto')

const onlineHandler = require('./online')
const offlineHandler = require('./offline')
const { botLog } = require('../api')

const handler = (req, res) => {

    botLog('info', 'twitch event subscription endpoint hit')

    if (crypto.timingSafeEqual(Buffer.from(`sha256=${crypto.createHmac('sha256', process.env.TWITCH_CLIENT_SECRET).update(`${req.headers['twitch-eventsub-message-id']}${req.headers['twitch-eventsub-message-timestamp']}${req.body}`).digest('hex')}`), Buffer.from(req.headers['twitch-eventsub-message-signature']))) {

        const notification = JSON.parse(req.body)

        const messageTypeHeader = req.headers['twitch-eventsub-message-type']

        switch (messageTypeHeader) {
            case 'notification':

                res.sendStatus(204)

                if (notification.subscription.type === 'stream.online') {
                    onlineHandler()
                } else if (notification.subscription.type === 'stream.offline') {
                    offlineHandler()
                }

                break

            case 'webhook_callback_verification':

                res.status(200).send(notification.challenge)

                botLog('info', 'twitch event subscription endpoint verified')

                break

            case 'revocation':

                res.sendStatus(204)

                throw `${notification.subscription.type} notifications revoked. Reason: ${notification.subscription.status} Condition: ${JSON.stringify(notification.subscription.condition, null, 4)}`

            default:

                res.sendStatus(204)

                botLog('warn', 'twitch event subscription endpoint hit with unknown message type: ${messageTypeHeader}')
        }
    }
    else {
        res.sendStatus(403)

        botLog('warn', 'request signature did not match twitch event subscription endpoint signature')

    }
}

module.exports = handler