console.log('Initializing requires...');

require('dotenv/config');

const tmi = require('tmi.js');
const mongoose = require('mongoose');
const API = require('./api');
const { Command } = require('./command');
const { Timer } = require('./timer');
const { Message } = require('./message');

console.log('Initializing enviroment variables...');

const botUsername = process.env.BOT_USERNAME;
const twitchAuth = process.env.TWITCH_OAUTH;
const twitchChannel = process.env.TWITCH_CHANNEL;
const databaseUsername = process.env.DATABASE_USERNAME;
const databasePassword = process.env.DATABASE_PASSWORD;

console.log('Initializing Twitch client...');

const client = new tmi.Client({
    options: { debug: true, messagesLogLevel: "info" },
    connection: {
        reconnect: true,
        secure: true
    },
    identity: {
        username: botUsername,
        password: twitchAuth
    },
    channels: [twitchChannel]
});

const randomRange = (min, max) => {
    return Math.floor((Math.random() * (max - min)) + min);
}

console.log('Initializing timers...');

const timers = {
    quote: new Timer(() => {
        API.getRandomQuote((quote, quoteIndex) => {
            client.say(twitchChannel, `Time for a random quote by ${twitchChannel}! Quote ${quoteIndex + 1}: ${quote}`);
        });
    }, randomRange(600000, 900000)),
    discord: new Timer(() => {
        client.say(twitchChannel, `Join us in our discourse at https://discord.com/invite/ANxbaZdRAY`);
    }, randomRange(1500000, 1800000))
};

console.log('Initializing commands...');

const commands = {
    '!commands': new Command(
        ({ userstate }) => {
            let commandsString = '';
            Object.entries(commands).forEach(([commandName, commandObject]) => {
                if (commandObject.enabled && commandObject.hasPermission(userstate)) {
                    commandsString += `${commandName}, `;
                }
            });
            let msg;
            if (commandsString == '') {
                msg = `${userstate.username}, you may not use any commands.`;
            } else {
                msg = `${userstate.username}, you may use these commands: ` + commandsString.slice(0, -2);
            }
            client.say(twitchChannel, msg);
        }
    ),
    '!enabletimer': new Command(
        ({ userstate, messageParms }) => {
            const timer = timers[messageParms];
            if (!timer) {
                return client.say(twitchChannel, `${userstate.username}, I do not know of a ${messageParms} timer.`);
            }
            if (timer.enabled) {
                return client.say(twitchChannel, `${userstate.username}, ${messageParms} is already enabled.`);
            }

            timer.setEnabled(true);
            client.say(twitchChannel, `${userstate.username} has enabled the ${messageParms} timer!`);
        },
        'mod'
    ),
    '!disabletimer': new Command(
        ({ userstate, messageParms }) => {
            const timer = timers[messageParms];
            if (!timer) {
                return client.say(twitchChannel, `${userstate.username}, I do not know of a ${messageParms} timer.`);
            }
            if (!timer.enabled) {
                return client.say(twitchChannel, `${userstate.username}, ${messageParms} is already disabled.`);
            }

            timer.setEnabled(false);
            client.say(twitchChannel, `${userstate.username} has disabled the ${messageParms} timer!`);
        },
        'mod'
    ),
    '!enablecommand': new Command(
        ({ userstate, messageParms }) => {
            const commandKeyword = `!${messageParms}`;
            const commandObject = commands[commandKeyword];
            if (!commandObject) {
                return client.say(twitchChannel, `${userstate.username}, I do not know ${commandKeyword}.`);
            }
            if (commandObject.enabled) {
                return client.say(twitchChannel, `${userstate.username}, ${commandKeyword} is already enabled.`);
            }

            commandObject.enabled = true;
            client.say(twitchChannel, `${commandKeyword} can be used again thanks to ${userstate.username}!`);
        },
        'mod'
    ),
    '!disablecommand': new Command(
        ({ userstate, messageParms }) => {
            const commandKeyword = `!${messageParms}`;
            if (commandKeyword == '!enablecommand' || commandKeyword == '!disablecommand') {
                return client.say(twitchChannel, `${userstate.username}, I cannot disable ${commandKeyword}.`);
            }
            const commandObject = commands[commandKeyword]
            if (!commandObject) {
                return client.say(twitchChannel, `${userstate.username}, I do not know ${commandKeyword}.`);
            }
            if (!commandObject.enabled) {
                return client.say(twitchChannel, `${userstate.username}, ${commandKeyword} is already disabled.`);
            }

            commandObject.enabled = false;
            client.say(twitchChannel, `${commandKeyword} can no longer be used thanks to ${userstate.username}!`);
        },
        'mod'
    ),
    '!enablemessage': new Command(
        ({ userstate, messageParms }) => {
            const message = messages.find(messageObject => messageObject.keyword == messageParms);
            if (!message) {
                return client.say(twitchChannel, `${userstate.username}, I do not know of a ${messageParms} message.`);
            }
            if (message.enabled) {
                return client.say(twitchChannel, `${userstate.username}, ${messageParms} is already enabled.`);
            }

            message.enabled = true;
            client.say(twitchChannel, `${userstate.username} has enabled the ${messageParms} message!`);
        },
        'mod'
    ),
    '!disablemessage': new Command(
        ({ userstate, messageParms }) => {
            const message = messages.find(messageObject => messageObject.keyword == messageParms);
            if (!message) {
                return client.say(twitchChannel, `${userstate.username}, I do not know of a ${messageParms} message.`);
            }
            if (!message.enabled) {
                return client.say(twitchChannel, `${userstate.username}, ${messageParms} is already disabled.`);
            }

            message.enabled = false;
            client.say(twitchChannel, `${userstate.username} has disabled the ${messageParms} message!`);
        },
        'mod'
    ),
    '!feed': new Command(
        ({ userstate }) => {
            if (randomRange(0, 10) == 0) {
                client.say(twitchChannel, `RaccAttack Crayon Oh no! A raccoon stole the crayon, ${userstate.username}!`);
                return;
            }
            const crayonsEaten = 0; //get from database
            client.say(twitchChannel, `popCat Crayon ${userstate.username}, thank you for feeding the cat! The cat has been fed ${crayonsEaten + 1} times.`);
            //set crayonsEaten in database
        }
    ),
    '!hug': new Command(
        ({ userstate }) => {
            if (randomRange(0, 10) == 0) {
                return client.say(twitchChannel, `RaccAttack Oh no! A raccoon stole the hug, ${userstate.username}!`);
            }
            client.say(twitchChannel, `catKISS ${userstate.username}, thank you for hugging the cat!`);
        }
    ),
    '!lurk': new Command(
        ({ userstate }) => {
            client.say(twitchChannel, `${userstate.username}, thank you for your presence!`);
        }
    ),
    '!discord': new Command(
        ({ userstate }) => {
            client.say(twitchChannel, `${userstate.username}, join us in our discourse at https://discord.com/invite/ANxbaZdRAY`);
        }
    ),
    '!quote': new Command(
        ({ userstate, messageParms }) => {
            if (!messageParms) {
                return API.getRandomQuote((quote, quoteIndex) => {
                    client.say(twitchChannel, `${userstate.username}, for you, I choose quote ${quoteIndex + 1}: ${quote}`);
                });
            }

            const quoteIndex = parseInt(messageParms) - 1;

            API.getQuote(quoteIndex, (quote) => {
                if (!quote) {
                    return API.getQuoteCount(quoteCount => {
                        client.say(twitchChannel, `${userstate.username}, you must choose a quote between 1 and ${quoteCount}.`);
                    });
                }

                client.say(twitchChannel, `${userstate.username}, here is quote ${quoteIndex + 1}: ${quote}`);
            });
        }
    ),
    '!addquote': new Command(
        ({ userstate, messageParms }) => {
            API.addQuote(messageParms, newQuotes => {
                client.say(twitchChannel, `Quote ${newQuotes.length} has been added thanks to ${userstate.username}!`);
            });
        },
        'mod'
    ),
    '!deletequote': new Command(
        ({ userstate, messageParms }) => {
            const quoteIndex = parseInt(messageParms) - 1;

            API.getQuoteCount(quoteCount => {
                if (quoteIndex == NaN || quoteIndex >= quoteCount) {
                    return client.say(twitchChannel, `${userstate.username}, you must choose a quote between 1 and ${quoteCount}.`);
                }

                API.deleteQuote(quoteIndex, quotes => {
                    client.say(twitchChannel, `Quote ${quoteIndex + 1} has been deleted thanks to ${userstate.username}!`);
                })
            });
        },
        'mod'
    ),
    '!editquote': new Command(
        ({ userstate, messageParms }) => {
            const parmsArray = messageParms.split(' ');
            const quoteIndex = parseInt(parmsArray.shift()) - 1;
            const newQuote = parmsArray.join(' ');

            API.getQuoteCount(quoteCount => {
                if (quoteIndex == NaN || quoteIndex >= quoteCount) {
                    return client.say(twitchChannel, `${userstate.username}, you must choose a quote between 1 and ${quoteCount}.`);
                }

                API.editQuote(quoteIndex, newQuote, quotes => {
                    client.say(twitchChannel, `Quote ${quoteIndex + 1} has been edited thanks to ${userstate.username}!`);
                })
            });
        },
        'mod'
    )
};

console.log('Initializing messages...');

const messages = [
    new Message('stonebot', ({ userstate }) => {
        client.say(twitchChannel, `${userstate.username}, you called?`);
    }),
    new Message('chess', ({ userstate }) => {
        const chess_tips = [];  //get from database
        client.say(twitchChannel, `${userstate.username}, here's a chess tip: ${chess_tips[randomRange(0, chess_tips.length)]}`);
    }),
    new Message('kansas', ({ userstate }) => {
        const kansas_facts = [];  //get from database
        client.say(twitchChannel, `${userstate.username}, here's a fact about Kansas: ${kansas_facts[randomRange(0, kansas_facts.length)]}`);
    }),
    new Message('crab', ({ userstate }) => {
        const crab_facts = [];  //get from database
        client.say(twitchChannel, `${userstate.username}, here's a fact about crabs: ${crab_facts[randomRange(0, crab_facts.length)]}`);
    }),
    new Message('hype', () => {
        client.say(twitchChannel, `HYPE`);
    }),
    new Message('peace', () => {
        client.say(twitchChannel, `PEACE`);
    }),
    new Message('mug', () => {
        client.say(twitchChannel, `MUG MOMENT`);
    }),
    new Message('divorce', () => {
        client.say(twitchChannel, `Hahaha`);
    })
];

console.log('Initializing Twitch event handlers...');

//#region twitch event handling

client.on('anongiftpaidupgrade', (channel, username, userstate) => {

});

client.on('cheer', (channel, userstate, message) => {

});

client.on('giftpaidupgrade', (channel, username, sender, userstate) => {

});

client.on('hosted', (channel, username, viewers, autohost) => {
    client.say(twitchChannel, `:O We're being hosted? Time to put on a good show!`);
});

client.on('join', (channel, username, self) => {
    if (self) {
        client.say(twitchChannel, `MercyWing1 :) MercyWing2 I have arrived!`);
        return;
    }
});

client.on('message', (channel, userstate, message, self) => {

    if (self) return;

    const messageLowerCase = message.toLocaleLowerCase();

    if (messageLowerCase.charAt(0) == '!') {
        const messageArray = messageLowerCase.split(' ');
        const command = messageArray.shift();
        const messageParms = messageArray.join(' ');

        const parms = {
            userstate,
            messageParms
        }

        const commandObject = commands[command];

        if (!commandObject) {
            return client.say(twitchChannel, `${userstate.username}, ${command} is not a command I know.`);
        }
        if (!commandObject.enabled) {
            return client.say(twitchChannel, `${userstate.username}, ${command} is currently disabled.`);
        }
        if (!commandObject.hasPermission(userstate)) {
            return client.say(twitchChannel, `${userstate.username}, you do not have permission to use ${command}.`);
        }

        return commandObject.handler(parms);
    }

    const parms = {
        userstate,
        messageLowerCase
    }

    messages.forEach(messageObject => {
        if (messageObject.enabled && messageObject.keywordRegex.test(messageLowerCase)) {
            messageObject.handler(parms);
        }
    });
});

client.on('raided', (channel, username, viewers, userstate) => {
    client.say(twitchChannel, `:O A raid!? Quickly, we must defend!`);
    setTimeout(() => {
        client.say(twitchChannel, `Huzzah to ${username} for bringing great content! Find them at https://twitch.tv/${username}. HSCheers`);
    }, 10000);
});

client.on('resub', (channel, username, streakMonths, message, userstate, methods) => {

});

client.on('subgift', (channel, username, streakMonths, recipient, methods, userstate) => {

});

client.on('submysterygift', (channel, username, giftSubCount, methods, userstate) => {

});

client.on('subscription', (channel, username, method, message, userstate) => {

});

//#endregion

console.log('Connecting to database...');

mongoose.connect(`mongodb+srv://${databaseUsername}:${databasePassword}@cluster0.qlwdj5s.mongodb.net/?retryWrites=true&w=majority`, () => {
    console.log('Connecting to Twitch...');
    client.connect().catch(console.error);
});