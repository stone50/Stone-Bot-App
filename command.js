require('dotenv/config');

const twitchChannel = process.env.TWITCH_CHANNEL;

const permissionHierarchy = [
    'viewer',
    'sub',
    'mod',
    'streamer'
];

class Command {
    constructor(handler, permission = 'viewer', enabled = true) {
        this.handler = handler;
        this.permission = permission;
        this.enabled = enabled;
    }

    hasPermission(userstate) {
        let userPermission = 'viewer';
        if (userstate.username == twitchChannel) {
            userPermission = 'streamer';
        } else if (userstate.mod) {
            userPermission = 'mod';
        } else if (userstate.subscriber) {
            userPermission = 'sub';
        }
        return permissionHierarchy.indexOf(this.permission) <= permissionHierarchy.indexOf(userPermission);
    }
};

exports.Command = Command;