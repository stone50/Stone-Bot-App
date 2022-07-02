class Message {
    constructor(keyword, handler, enabled = true) {
        let regexStr = '\\b';
        for (let i = 0; i < keyword.length; i++) {
            regexStr += `(${keyword[i]} *)+`;
        }
        regexStr += '\\b';
        this.keywordRegex = new RegExp(regexStr);
        this.keyword = keyword;
        this.handler = handler;
        this.enabled = enabled;
    }
};

exports.Message = Message;