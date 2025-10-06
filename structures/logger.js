const moment = require("moment");
let chalk;

import('chalk').then((module) => {
    chalk = module.default;
});


class Logger {
    static log(content, type = 'log') {
        const timestamp = `[${moment().utcOffset('+05:30').format('DD.MM.yyyy hh:mm')}] :`

        switch(type) {
            case 'log': {
                return console.log(
                    `${timestamp} ${chalk.bgBlue(
                        type.toUpperCase()
                    )} ${content} `
                )
            }

            case 'ready': {
                return console.log(
                    `${timestamp} ${chalk.bgYellow(
                        type.toUpperCase()
                    )} ${content} `
                )
            }

            case 'error': {
                return console.log(
                    `${timestamp} ${chalk.red(
                        type.toUpperCase()
                    )} ${content} `
                )
            }

            case 'mongo': {
                return console.log(
                    `${timestamp} ${chalk.bgGreen(
                        type.toUpperCase()
                    )} ${content} `
                )
            }

            case 'cmd': {
                return console.log(
                    `${timestamp} ${
                        type.toUpperCase()
                    } ${content} `
                )
            }

            case 'event': {
                return console.log(
                    `${timestamp} ${
                        type.toUpperCase()
                    } ${content} `
                )
            }

            case 'shard': {
                return console.log(
                    `${timestamp} ${chalk.bgGreen(
                        type.toUpperCase()
                    )} ${content} `
                )
            }

            case 'vote': {
                return console.log(
                    `${timestamp} ${chalk.bgBlue(
                        type.toUpperCase()
                    )} ${content} `
                )
            }
        }
    }

    static error(content) {
        return this.log(content, 'error')
    }
    
    static cmd(content) {
        return this.log(content, 'cmd')
    }

    static ready(content) {
        return this.log(content, 'ready')
    }

    static event(content) {
        return this.log(content, 'event')
    }

    static shard(content) {
        return this.log(content, 'shard')
    }
}

module.exports = Logger;