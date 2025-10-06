const { PermissionsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js")

module.exports = {
    name: "ignore",
    aliases: [],
    category: "moderation",
    description: "Helps you configure the ignore module",
    usage: "?ignore channel/command/user <add/remove/show/reset> <channel/command/user>",
    cooldown: 5,

    run: async (client, message, args, prefix) => {

        if (!message.member.permissions.has(PermissionsBitField.resolve("ManageGuild")))
            return message.channel.send(`${client.emoji.cross} | You need to have \`Manager Guild\` permission in order to use this command.`);

        if (!message.guild.members.me.permissions.has(PermissionsBitField.resolve("ManageGuild")))
            return message.channel.send(`${client.emoji.cross} | I need to have \`Manager Guild\` permission in order to use this command.`);

        const flame = client.users.cache.get(`${client.dev}`);

        if (!args[0]) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setAuthor({
                            name: `${prefix}ignore channel/command/user <add/remove/show/reset> <channel/command/user>`,
                            iconURL: `${flame.displayAvatarURL({ dynamic: true })}`
                        }).addFields(
                            {
                                name: `${client.emoji.dot} \`${prefix}ignore channel add <channel>\``,
                                value: `${client.emoji.blank}Adds a channel to the ignore list.`
                            },
                            {
                                name: `${client.emoji.dot} \`${prefix}ignore channel remove <channel>\``,
                                value: `${client.emoji.blank}Removes a channel from the ignore list.`
                            },
                            {
                                name: `${client.emoji.dot} \`${prefix}ignore channel show\``,
                                value: `${client.emoji.blank}Shows the channels present in the ignore list.`
                            },
                            {
                                name: `${client.emoji.dot} \`${prefix}ignore channel reset\``,
                                value: `${client.emoji.blank}Resets the ignore channel list.`
                            },
                            {
                                name: `${client.emoji.dot} \`${prefix}ignore command add <command>\``,
                                value: `${client.emoji.blank}Adds a command to the ignore list.`
                            },
                            {
                                name: `${client.emoji.dot} \`${prefix}ignore command remove <command>\``,
                                value: `${client.emoji.blank}Removes a command from the ignore list.`
                            },
                            {
                                name: `${client.emoji.dot} \`${prefix}ignore command show\``,
                                value: `${client.emoji.blank}Shows the commands present in the ignore list.`
                            },
                            {
                                name: `${client.emoji.dot} \`${prefix}ignore command reset\``,
                                value: `${client.emoji.blank}Resets the ignore command list.`
                            },
                        )
                        .setThumbnail(message.guild.iconURL({ dynamic: true }))
                        .setFooter({
                            text: `Requested by ${message.author.tag}`,
                            iconURL: message.author.displayAvatarURL({ dynamic: true })
                        })
                ]
            });
        }

        if (args[0].toLowerCase() === "channel") {

            let ignoreChannel = await client.db.get(`ignoreChannel_${message.guild.id}`) ? await client.db.get(`ignoreChannel_${message.guild.id}`) : [];

            if (!args[1]) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setAuthor({
                                name: `${prefix}ignore channel <add/remove/show/reset> <channel>`,
                                iconURL: flame.displayAvatarURL()
                            })
                            .addFields(
                                {
                                    name: `${client.emoji.dot} \`${prefix}ignore channel add <channel>\``,
                                    value: `${client.emoji.blank}Adds a channel to the ignore list.`
                                },
                                {
                                    name: `${client.emoji.dot} \`${prefix}ignore channel remove <channel>\``,
                                    value: `${client.emoji.blank}Removes a channel from the ignore list.`
                                },
                                {
                                    name: `${client.emoji.dot} \`${prefix}ignore channel show\``,
                                    value: `${client.emoji.blank}Shows the channels present in the ignore list.`
                                },
                                {
                                    name: `${client.emoji.dot} \`${prefix}ignore channel reset\``,
                                    value: `${client.emoji.blank}Resets the ignore channel list.`
                                }
                            )
                    ]
                });
            }

            if (args[1].toLowerCase() === "add" || args[1].toLowerCase() === "a") {
                const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2]);

                if (!channel)
                    return message.channel.send(`${client.emoji.cross} | Please mention a channel or provide a valid channel ID.`);

                if (ignoreChannel.includes(channel.id)) {
                    return message.channel.send(`${client.emoji.cross} | ${channel} is already present in the ignore channel list.`);
                }

                // const res = await client.snek.get(`https://top.gg/api/bots/1107867557995749448/check?userId=${message.author.id}`, {
                //     method: 'GET',
                //     headers: {
                //         Authorization: client.config.TOPGG_API,
                //     },
                // });

                //const data = await res.data;

                if (ignoreChannel.length > 10 && !(developer || owners)) {
                    // let b = new ButtonBuilder()
                    //     .setStyle(ButtonStyle.Link)
                    //     .setURL(`${client.vote}`)
                    //     .setLabel(`Vote For ${client.user.username}`)
                    // let row = new ActionRowBuilder().addComponents(b);
    
                    return message.channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color)
                                .setDescription(`You cannot add more than \`10\` channels in the ignore channel list.`)
                        ]
                    });
                }

                await ignoreChannel.push(channel.id);
                await client.db.set(`ignoreChannel_${message.guild.id}`, ignoreChannel);

                return message.channel.send(`${client.emoji.tick} | ${channel} has been added to the ignore channel list.`);
            }

            if (args[1].toLowerCase() === "remove" || args[1].toLowerCase() === "r") {
                const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2]);

                if (!channel)
                    return message.channel.send(`${client.emoji.cross} | Please mention a channel or provide a valid channel ID.`);

                if (!ignoreChannel.includes(channel.id)) {
                    return message.channel.send(`${client.emoji.cross} | ${channel} is not present in the ignore channel list.`);
                }

                await client.db.pull(`ignoreChannel_${message.guild.id}`, `${channel.id}`);

                return message.channel.send(`${client.emoji.tick} | ${channel} has been removed from the ignore channel list.`);
            }

            if (args[1].toLowerCase() === "show" || args[1].toLowerCase() === "list") {
                if (ignoreChannel.length === 0)
                    return message.channel.send(`${client.emoji.cross} | There are no channels in the ignore channel list.`);

                let channels = [];

                for (let i = 0; i < ignoreChannel.length; i++) {
                    let channel = await client.channels.cache.get(ignoreChannel[i]);
                    channels.push(`\`[${i + 1}.]\` ${channel} \`${channel.name} (${channel.id})\``)
                }

                const mapping = (require("lodash")).chunk(channels, 4);
                const descriptions = mapping.map((s) => s.join("\n"));

                var pages = [];

                for (let i = 0; i < descriptions.length; i++) {
                    const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(descriptions[i])
                        .setFooter({
                            text: `Page ▪ ${i + 1} of ${descriptions.length}`,
                            iconURL: client.user.displayAvatarURL()
                        })
                        .setTimestamp()
                        .setAuthor({
                            name: client.user.username,
                            iconURL: client.user.displayAvatarURL()
                        })
                        .setThumbnail(message.guild.iconURL({ dynamic: true }))
                        .setTitle(`Ignore Channel List : `)

                    pages.push(embed);
                }

                if (pages.length === 1) {
                    return message.channel.send({
                        embeds: [pages[0].setFooter({
                            text: `Requested by ${message.author.tag}`,
                            iconURL: message.author.displayAvatarURL({ dynamic: true })
                        })]
                    })
                } else {
                    return pagination(message.channel, message.author, pages)
                }
            }

            if (args[1].toLowerCase() === "reset" || args[1].toLowerCase() === "clear") {
                if (ignoreChannel.length === 0)
                    return message.channel.send(`${client.emoji.cross} | There are no channels in the ignore channel list.`);

                await client.db.delete(`ignoreChannel_${message.guild.id}`);

                return message.channel.send(`${client.emoji.tick} | Ignore channel list has been reset.`);
            }
        }

        if (args[0].toLowerCase() === "command") {

            let ignoreCommand = await client.db.get(`ignoreCommand_${message.guild.id}`) ? await client.db.get(`ignoreCommand_${message.guild.id}`) : [];

            if (!args[1]) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setAuthor({
                                name: `${prefix}ignore command <add/remove/show/reset> <command>`,
                                iconURL: flame.displayAvatarURL()
                            })
                            .addFields(
                                {
                                    name: `${client.emoji.dot} \`${prefix}ignore command add <command>\``,
                                    value: `${client.emoji.blank}Adds a command to the ignore list.`
                                },
                                {
                                    name: `${client.emoji.dot} \`${prefix}ignore command remove <command>\``,
                                    value: `${client.emoji.blank}Removes a command from the ignore list.`
                                },
                                {
                                    name: `${client.emoji.dot} \`${prefix}ignore command show\``,
                                    value: `${client.emoji.blank}Shows the commands present in the ignore list.`
                                },
                                {
                                    name: `${client.emoji.dot} \`${prefix}ignore command reset\``,
                                    value: `${client.emoji.blank}Resets the ignore command list.`
                                }
                            )
                    ]
                });
            }

            if (args[1].toLowerCase() === "add" || args[1].toLowerCase() === "a") {

                const commandName = args[2];

                const command = await client.commands.get(commandName) || await client.commands.find(c => c.aliases?.includes(commandName.toLowerCase()));

                if (!command)
                    return message.channel.send(`${client.emoji.cross} | Please provide a valid command name.`);

                if (ignoreCommand.includes(command.name)) {
                    return message.channel.send(`${client.emoji.cross} | \`${command.name}\` is already present in the ignore command list.`);
                }

                if (ignoreCommand.length > 10 && !(developer || owners)) {
                    return message.channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color)
                                .setDescription(`You cannot add more than \`10\` commands in the ignore command list.`)
                        ]
                    });
                }

                await ignoreCommand.push(command.name);
                await client.db.set(`ignoreCommand_${message.guild.id}`, ignoreCommand);

                return message.channel.send(`${client.emoji.tick} | \`${command.name}\` has been added to the ignore command list.`);
            
            }

            if (args[1].toLowerCase() === "remove" || args[1].toLowerCase() === "r") {
                    
                    const commandName = args[2];
    
                    const command = await client.commands.get(commandName) || await client.commands.find(c => c.aliases?.includes(commandName.toLowerCase()));
    
                    if (!command)
                        return message.channel.send(`${client.emoji.cross} | Please provide a valid command name.`);
    
                    if (!ignoreCommand.includes(command.name)) {
                        return message.channel.send(`${client.emoji.cross} | \`${command.name}\` is not present in the ignore command list.`);
                    }
    
                    await client.db.pull(`ignoreCommand_${message.guild.id}`, `${command.name}`);
    
                    return message.channel.send(`${client.emoji.tick} | \`${command.name}\` has been removed from the ignore command list.`);
            }

            if (args[1].toLowerCase() === "show" || args[1].toLowerCase() === "list") {
                if (ignoreCommand.length === 0)
                    return message.channel.send(`${client.emoji.cross} | There are no commands in the ignore command list.`);

                let commands = [];

                for (let i = 0; i < ignoreCommand.length; i++) {
                    let command = ignoreCommand[i];
                    commands.push(`\`[${i + 1}.]\` \`${command}\``)
                }

                const mapping = (require("lodash")).chunk(commands, 4);
                const descriptions = mapping.map((s) => s.join("\n"));

                var pages = [];

                for (let i = 0; i < descriptions.length; i++) {
                    const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(descriptions[i])
                        .setFooter({
                            text: `Page ▪ ${i + 1} of ${descriptions.length}`,
                            iconURL: client.user.displayAvatarURL()
                        })
                        .setAuthor({
                            name: client.user.username,
                            iconURL: client.user.displayAvatarURL()
                        })
                        .setThumbnail(message.guild.iconURL({ dynamic: true }))
                        .setTitle(`Ignore Command List : `)

                    pages.push(embed);
                }

                if (pages.length === 1) {
                    return message.channel.send({
                        embeds: [pages[0].setFooter({
                            text: `Requested by ${message.author.tag}`,
                            iconURL: message.author.displayAvatarURL({ dynamic: true })
                        })]
                    })
                } else {
                    return pagination(message.channel, message.author, pages)
                }
            }

            if (args[1].toLowerCase() === "reset" || args[1].toLowerCase() === "clear") {
                if (ignoreCommand.length === 0)
                    return message.channel.send(`${client.emoji.cross} | There are no commands in the ignore command list.`);

                await client.db.delete(`ignoreCommand_${message.guild.id}`);

                return message.channel.send(`${client.emoji.tick} | Ignore command list has been reset.`);
            }
        }
    }
};


async function pagination(channel, author, pages, timeout = 3000 * 5) {
    if (!channel || !pages || pages.length === 0)
        return;

    let b1 = new ButtonBuilder()
        .setCustomId(`back`)
        .setStyle(ButtonStyle.Secondary)
        .setEmoji(`${channel.client.emoji.left2}`)

    let b2 = new ButtonBuilder()
        .setCustomId(`home`)
        .setStyle(ButtonStyle.Success)
        .setEmoji(`${channel.client.emoji.home}`)

    let b3 = new ButtonBuilder()
        .setCustomId(`next`)
        .setStyle(ButtonStyle.Secondary)
        .setEmoji(`${channel.client.emoji.right2}`)

    let b4 = new ButtonBuilder()
        .setCustomId(`end`)
        .setStyle(ButtonStyle.Danger)
        .setEmoji(`${channel.client.emoji.delete}`)

    const row = new ActionRowBuilder()
        .addComponents(b1, b2, b3, b4)

    let page = 0;
    const curPage = await channel.send({
        embeds: [pages[page].setFooter({ text: `Page ▪ ${page + 1} of ${pages.length}`, })],
        components: [row]
    });

    const collector = curPage.createMessageComponentCollector({
        filter: (interaction) => {
            if (author.id === interaction.user.id)
                return true;
            else
                interaction.reply({
                    content: `${channel.client.emoji.cross} | Only **${author.tag}** Can Use This Interaction.`,
                    ephemeral: true
                });
        },
        time: timeout,
        idle: timeout / 2
    });

    collector.on('collect', async (i) => {
        await i.deferUpdate();

        switch (i.customId) {
            case "home":
                page = 0;
                await curPage.edit({
                    embeds: [
                        pages[page].setFooter({
                            text: `Page ▪ ${page + 1} of ${pages.length}`,
                        }),
                    ],
                });
                break;

            case "back":
                page = page > 0 ? --page : pages.length - 1;
                await curPage.edit({
                    embeds: [
                        pages[page].setFooter({
                            text: `Page ▪ ${page + 1} of ${pages.length}`,
                        }),
                    ],
                });
                break;

            case "next":
                page = page + 1 < pages.length ? ++page : 0;
                await curPage.edit({
                    embeds: [
                        pages[page].setFooter({
                            text: `Page ▪ ${page + 1} of ${pages.length}`,
                        }),
                    ],
                });
                break;

            case "end":
                await curPage.delete().catch(() => { });
                break;
        }
    });

    collector.on('end', () => curPage.edit({
        components: []
    }));
}