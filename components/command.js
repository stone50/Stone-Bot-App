class Command {
    constructor(keyword, handler, permission, enabled) {
        this.keyword = keyword
        this.handler = handler
        this.permission = permission
        this.enabled = enabled
    }
}

module.exports = Command