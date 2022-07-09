class Message {
    constructor(keyword, regexStr, handler, enabled) {
        this.keyword = keyword
        this.regexStr = regexStr
        this.regex = new RegExp(regexStr)
        this.handler = handler
        this.enabled = enabled
    }
}

module.exports = Message