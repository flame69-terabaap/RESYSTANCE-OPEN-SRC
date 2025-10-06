const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Permissions,
    Collection,
    PermissionsBitField,
    WebhookClient
} = require("discord.js");

module.exports = async (client) => {
    client.on('messageCreate', async (message) => {
        if (message.author.bot || !message.guild)
            return;

        let b1 = new ButtonBuilder()
            .setLabel(`Invite ${client.user.username}`)
            .setStyle(ButtonStyle.Link)
            .setURL(`${client.invite}`)

        let b2 = new ButtonBuilder()
            .setLabel(`Support Server`)
            .setStyle(ButtonStyle.Link)
            .setURL(`${client.support}`)

        const row = new ActionRowBuilder().addComponents(b1, b2);

        const prefix = await client.db.get(`prefix_${message.guild.id}`) || '?';

        let developer = client.dev.includes(message.author.id);

        let owner = client.owners.includes(message.author.id);

        let ignoreChannel = await client.db.get(`ignoreChannel_${message.guild.id}`) ? await client.db.get(`ignoreChannel_${message.guild.id}`) : [];

        let ignoreCommand = await client.db.get(`ignoreCommand_${message.guild.id}`) ? await client.db.get(`ignoreCommand_${message.guild.id}`) : [];

        const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);

        if (message.content.match(mention)) {
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: message.guild.name,
                    iconURL: (message.guild.iconURL() ? message.guild.iconURL() : message.author.displayAvatarURL({ dynamic: true }))
                })
                .setColor(client.color)
                .setDescription(
                    `Hey ${message.author.username}, I am ${client.user.username}, a multipurpose discord bot with exciting features.\n\nIn order to get started using the bot, use \`${guildPrefix}help\`.\n\nIf you have any problem using the bot, feel free to reach out to our [Support Server](${client.support})`
                )
                .setFooter({
                    text: `Developed With 🖤 By flame._69`,
                })

            message.channel.send({
                embeds: [embed],
                components: [row]
            })
        }

        const prefixRegex = new RegExp(
            `^<@!?${client.user.id}>( |)`,
        );

        let botPrefix = message.content.match(prefixRegex) ? message.content.match(prefixRegex)[0] : prefix;

        if (!message.content.startsWith(botPrefix))
            return;

        const args = message.content.slice(botPrefix.length).trim().split(/ +/);

        const cmdName = args.shift().toLowerCase();

        const cmd = client.commands.get(cmdName) || client.commands.find(c => c.aliases?.includes(cmdName.toLowerCase()));

        if (!cmd)
            return;

        if (ignoreChannel.includes(message.channel.id) && !(developer || owner)) {
            let emb = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`${client.emoji.cross} | ${message.author} : This channel is present in my ignore channel list. Kindly use another channel for executing my commands.`);

            return message.channel.send({
                embeds: [emb]
            }).then((msg) => {
                setTimeout(() => msg.delete(), 5000);
            }).catch((err) => { });
        }

        if (ignoreCommand.includes(cmd.name) && !(developer || owner)) {
            let emb = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`${client.emoji.cross} | ${message.author} : This command is present in my ignore command list. You cannot use this command in this server.`);

            return message.channel.send({
                embeds: [emb]
            }).then((msg) => {
                setTimeout(() => msg.delete(), 5000);
            }).catch((err) => { });
        }

        const webhook = client.webhook_cmd_logs;

        await cmd.run(client, message, args, prefix);
        try {
            webhook.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setAuthor({
                            name: `${cmd.name} Executed By : ${message.author.username} In ${message.guild.name}`,
                            iconURL: message.guild.iconURL({ dynamic: true })
                        })
                        .setThumbnail(`${message.author.displayAvatarURL({ dynamic: true })}`)
                        .addFields({
                            name: `${client.emoji.animatedarrow} Command Name :`,
                            value: `\`\`\`yaml\n${cmd.name}\`\`\``
                        },
                            {
                                name: `${client.emoji.animatedarrow} Original Message :`,
                                value: `\`\`\`yaml\n=> ${message.content}\`\`\`\n=> ${message.content}`
                            },
                            {
                                name: `${client.emoji.animatedarrow} Command Executed By :`,
                                value: `User Name: \`\`\`yaml\n ${message.author.username}\`\`\` | User ID: [${message.author.id}](https://discord.com/users/${message.author.id}) | User Mention: <@${message.author.id}>`
                            },
                            {
                                name: `${client.emoji.animatedarrow} Command Executed In Server :`,
                                value: `Server Name: \`\`\`yaml\n${message.guild.name}\`\`\` | Server ID: [${message.guild.id}](https://discord.com/channels/${message.guild.id})`
                            },
                            {
                                name: `${client.emoji.animatedarrow} Command Executed In Channel :`,
                                value: `Channel Name: \`\`\`${message.channel.name}\`\`\` | Channel ID: [${message.channel.id}](https://discord.com/channels/${message.guild.id}/${message.channel.id}) | Channel Mention: `
                            },
                            {
                                name: `Jump To Message :`,
                                value: `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`
                            })
                        .setFooter({
                            text: `Developed With 🖤 By flame._69`,
                            iconURL: client.users.cache.get(`855690571535876157`).displayAvatarURL({ dynamic: true })
                        })
                ]
            });
        } catch (err) {
            if (err.code === 429) {
                await client.utils.ratelimitHandler();
            }
            return;
        }
    });
};