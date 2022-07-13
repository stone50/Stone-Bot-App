const crypto = require('crypto')

const onlineHandler = require('./online')
const offlineHandler = require('./offline')

const handler = (req, res) => {
    const secret = 'your secret goes here'
    const message = req.headers['twitch-eventsub-message-id'] + req.headers['twitch-eventsub-message-timestamp'] + req.body
    const hmac = 'sha256=' + crypto.createHmac('sha256', secret).update(message).digest('hex')

    if (crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(req.headers['twitch-eventsub-message-signature']))) {
        console.log('signatures match')

        // Get JSON object from body, so you can process the message.
        const notification = JSON.parse(req.body)

        const messageTypeHeader = req.headers['twitch-eventsub-message-type']

        switch (messageTypeHeader) {
            case 'notification':
                if (notification.subscription.type === 'stream.online') {
                    onlineHandler()
                } else if (notification.subscription.type === 'stream.offline') {
                    offlineHandler()
                }

                console.log(`Event type: ${notification.subscription.type}`)
                console.log(JSON.stringify(notification.event, null, 4))

                res.sendStatus(204)
                break

            case 'webhook_callback_verification':
                res.status(200).send(notification.challenge)
                break

            case 'revocation':
                res.sendStatus(204)

                console.log(`${notification.subscription.type} notifications revoked!`)
                console.log(`reason: ${notification.subscription.status}`)
                console.log(`condition: ${JSON.stringify(notification.subscription.condition, null, 4)}`)
                break

            default:
                res.sendStatus(204)
                console.log(`Unknown message type: ${messageTypeHeader}`)
        }
    }
    else {
        console.log('403')    // Signatures didn't match.
        res.sendStatus(403)
    }
}

module.exports = handler