const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionsBitField
} = require("discord.js");

let globalCooldown = false;

class Utils {
    constructor(client) {
        this.client = client
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    hasHigherRole(member) {
        if (member.roles.highest.position <=
            member.guild.me.roles.highest.position &&
            member.user.id !== member.guild.ownerId &&
            member.user.id !== this.client.dev
        )
            return false
        else return true
    }


    async pagination(message, description, desc = '') {
        const lodash = require("lodash");

        let prevBut = new ButtonBuilder()
            .setCustomId(`PREV_BUT`)
            .setEmoji('<:BB_lefttarrow:1238889662639116319>')
            .setStyle(ButtonStyle.Secondary)

        let nextBut = new ButtonBuilder()
            .setCustomId('NEXT_BUT')
            .setEmoji('<:BB_righttarrow:1238889664987922473>')
            .setStyle(ButtonStyle.Secondary)

        let buttonrow = new ActionRowBuilder().addComponents(prevBut, nextBut);
        
        const pages = lodash.chunk(description, 10).map((x) => x.join(`\n`))

        let page = 0;
        let msg;

        if (pages.length <= 1) {
            return await message.channel.send(`${desc + this.client.utils.codeText(pages[page])}`)
        } else {
            msg = await message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.client.color)
                        .setDescription(`${desc + this.client.utils.codeText(pages[page])}`)
                ],
                components: [buttonrow]
            })
        }
util
        const collector = message.channel.createMessageComponentCollector({
            filter: (c) => {
                if (c.user.id === message.author.id) return true;
                else {
                    c.reply({
                        content: `Only ${message.author.username}#${messgae.author.discriminator} Can Use This Interaction.`,
                        ephemeral: true,
                    })
                    return false;
                }
            },
            time: 60000 * 5,
            idle: 30e3
        })

        collector.on('collect', async (c) => {
            if (!c.deferred) await c.deferUpdate().catch(() => {})
            if (c.message.id !== msg.id) return;
            if (c.customId === 'PREV_BUT') {
                page = page - 1 < 0 ? pages.length - 1 : --page
                return await msg
                    .edit({
                        content: desc + this.client.utils.codeText(pages[page])
                    })
                    .catch((e) => {
                        return;
                    })
            } else if (c.customId === 'NEXT_BUT') {
                page = page + 1 >= pages.length ? 0 : ++page
            }
            if (!msg) return;
            return await msg
                .edit({
                    content: desc + this.client.utils.codeText(pages[page])
                })
                .catch((e) => {
                    return;
                })
        })
        collector.on('end', async () => {
            await msg.edit({
                components: []
            }).catch((e) => {
                return;
            })
        })
    }
    
    codeText(text, type = 'js') {
        return `\`\`\`${type}\n${text}\`\`\``
    }

    async afkManager(message, client) {
        const db = require("../schema/afk.js");

        let data = await db.findOne({
            Guild: message.guildId,
            Member: message.author.id
        });
        if (data) {
            if (message.author.id === data.Member) {
                await data.deleteOne();
                return message.reply("You AFK has been removed!");
            }
        }

        const mentionedMember = message.mentions.users.first();

        if (mentionedMember) {
            data = await db.findOne({
                Guild: message.guildId,
                Member: mentionedMember.id
            });
            if (data) {
                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(`<@${mentionedMember.id}> has been AFK since <t:${Math.round(data.Time / 1000)}:R>\n\nAFK Reason: *${data.Reason}*`)
                
                return message.reply({
                    embeds: [embed]
                });
            } else {
                return;
            }
        }
    };

    async ratelimitHandler() {
        globalCooldown = true
        await this.client.utils.sleep(5000)
        globalCooldown = false
    }
}

module.exports = Utils;