const {
    Client,
    Collection,
    GatewayIntentBits,
    WebhookClient,
    ActivityType,
} = require("discord.js");
const fs = require("fs");
const mongoose = require("mongoose");
const Utils = require('./utils');
const { Database } = require("quickmongo");
const ms = require("ms");

class Vile extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildModeration,
                GatewayIntentBits.GuildEmojisAndStickers,
            ],
        });

        this.setMaxListeners(Infinity);
        this.logger = require('./logger');
        this.emoji = require('../emoji.json');
        this.config = require('../config.json');
        this.utils = new Utils(this);

        this.token = this.config.token;
        this.clientId = this.config.clientId;
        this.prefix = this.config.prefix;
        this.dev = this.config.dev;
        this.owners = this.config.owners;

        this.webhook_cmd_logs = new WebhookClient({
            url: this.config.cmd
        });
        this.webhook_error_logs = new WebhookClient({
            url: this.config.error
        });
        this.webhook_guild_join_logs = new WebhookClient({
            url: this.config.join
        });
        this.webhook_guild_leave_logs = new WebhookClient({
            url: this.config.leave
        });
        this.webhook_noprefix_logs = new WebhookClient({
            url: this.config.nplogs
        });
        this.webhook_blacklist_logs = new WebhookClient({
            url: this.config.bllogs
        });
        this.webhook_globalban_logs = new WebhookClient({
            url: this.config.gbanlogs
        });

        this.color = this.config.embedColor;
        this.support = this.config.supportServer;
        this.invite = this.config.botInvite;

        this.db = new Database(this.config.MONGO_DB);

        this.commands = new Collection();
        this.aliases = new Collection();
        this.events = new Collection();

        this.categories = fs.readdirSync(`./commands/`);

        this.on('ready', async () => {
            let uptime = Math.round(process.uptime() - this.uptime) * 1000;

            this.logger.log(`${this.user.tag} | Successfully Loaded in ${ms(uptime)}`, 'ready');

            this.user.setPresence({
                status: `online`,
                activities: [{
                    name: `${this.prefix}help | ${this.prefix}invite`,
                    type: ActivityType.Listening,
                }]
            });
        });

        this.on('error', (error) => {
            this.webhook_error_logs.send(`\`\`\`js\n${error.stack}\`\`\``)
        });

        this.db.connect()
        mongoose.connect(this.config.MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
            .then(() => this.logger.log('Successfully Connected to the Database.', 'mongo'));
    }
    loadEvents() {
        fs.readdirSync('./events/').forEach((file) => {
            let eventName = file.split('.')[0]
            require(`${process.cwd()}/events/${file}`)(this)
            this.logger.log(`Updated Event ${eventName}.`, 'event')
        })

    }

    loadMain() {
        const commandFiles = []

        const commandDirectories = fs.readdirSync(`${process.cwd()}/commands`)

        for (const directory of commandDirectories) {
            const files = fs
                .readdirSync(`${process.cwd()}/commands/${directory}`)
                .filter((file) => file.endsWith('.js'))

            for (const file of files) {
                commandFiles.push(
                    `${process.cwd()}/commands/${directory}/${file}`
                )
            }
        }
        commandFiles.map((value) => {
            const file = require(value)
            const splitted = value.split('/')
            const directory = splitted[splitted.length - 2]
            if (file.name) {
                const properties = { directory, ...file }
                this.commands.set(file.name, properties)
            }
        })

        this.logger.log(`Updated ${this.commands.size} Commands.`, 'cmd')
    }

    connect = () => {
        return super.login(this.token);
    };

}


module.exports = { Vile };