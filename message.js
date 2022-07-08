class Message {
    constructor(keyword, regexStr, responses, enabled) {
        this.keyword = keyword
        this.regexStr = regexStr
        this.regex = new RegExp(regexStr)
        this.responses = responses
        this.enabled = enabled
    }
}

module.exports = Message