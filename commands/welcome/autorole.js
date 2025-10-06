const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    name: "autorole",
    aliases: ["ar", "autoroles"],
    description: "Set autoroles for bots and humans",
    category: "welcome",
    usage: "?autorole <humans/bots/show/reset> [add/remove] [role]",
    cooldown: 5,

    run: async (client, message, args, prefix) => {

        let autoroleHumans = await client.db.get(`autoroleHumans_${message.guild.id}`) ? await client.db.get(`autoroleHumans_${message.guild.id}`) : [];
        let autoroleBots = await client.db.get(`autoroleBots_${message.guild.id}`) ? await client.db.get(`autoroleBots_${message.guild.id}`) : [];

        const pre = await client.db.get(`prefix_${message.guild.id}`) ? await client.db.get(`prefix_${message.guild.id}`) : prefix;
        const developer = client.dev.includes(message.author.id);

        if (!args[0]) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setAuthor({
                            name: `${pre}autorole <humans/bots> <add/remove/show/reset> [role]`,
                            iconURL: client.user.displayAvatarURL({ dynamic: true })
                        })
                        .addFields(
                            {
                                name: `${client.emoji.dot} \`${pre}autorole humans add <role>\``,
                                value: `${client.emoji.blank}Adds a role to the human autoroles list.`
                            },
                            {
                                name: `${client.emoji.dot} \`${pre}autorole humans remove <role>\``,
                                value: `${client.emoji.blank}Removes a role from the human autoroles list.`
                            },
                            {
                                name: `${client.emoji.dot} \`${pre}autorole humans show\``,
                                value: `${client.emoji.blank}Shows the human autoroles list.`
                            },
                            {
                                name: `${client.emoji.dot} \`${pre}autorole humans reset\``,
                                value: `${client.emoji.blank}Resets the human autoroles list.`
                            },
                            {
                                name: `${client.emoji.dot} \`${pre}autorole bots add <role>\``,
                                value: `${client.emoji.blank}Adds a role to the bot autoroles list.`
                            },
                            {
                                name: `${client.emoji.dot} \`${pre}autorole bots remove <role>\``,
                                value: `${client.emoji.blank}Removes a role from the bot autoroles list.`
                            },
                            {
                                name: `${client.emoji.dot} \`${pre}autorole bots show\``,
                                value: `${client.emoji.blank}Shows the bot autoroles list.`
                            },
                            {
                                name: `${client.emoji.dot} \`${pre}autorole bots reset\``,
                                value: `${client.emoji.blank}Resets the bot autoroles list.`
                            }
                        )
                        .setFooter({
                            text: `Requested By ${message.author.tag}`,
                            iconURL: message.author.displayAvatarURL({ dynamic: true })
                        })
                ]
            });
        }

        if (!message.member.permissions.has(PermissionsBitField.resolve("Administrator")))
            return message.channel.send(`${client.emoji.cross} | You need \`Administrator\` permission to use this command.`);

        if (!message.guild.members.me.permissions.has(PermissionsBitField.resolve("ManageRoles")))
            return message.channel.send(`${client.emoji.cross} | I need \`Manage Roles\` permission to use this command.`);

        if (message.member.roles.highest.position <= message.guild.members.me.roles.highest.position && !message.author.id === message.guild.ownerId && !developer)
            return message.channel.send(`${client.emoji.cross} | Your need to have a role that is above my top role.`);

        if (args[0].toLowerCase() === "humans" || args[0].toLowerCase() === "human") {

            if (args[1].toLowerCase() === "add" || args[1].toLowerCase() === "set") {

                let roleID = message.mentions.roles.first()?.id || message.guild.roles.cache.get(args[2])?.id;

                let role = roleID ? await message.guild.roles.cache.get(roleID) : null;

                if (!role || !roleID)
                    return message.channel.send(`${client.emoji.cross} | Please mention a role provide a valid role id.`);

                if (role.managed === true)
                    return message.channel.send(`${client.emoji.cross} | You can't add an integrated role to the autorole list.`);

                if (role.permissions.has([
                    PermissionsBitField.resolve("Administrator") ||
                    PermissionsBitField.resolve("BanMembers") ||
                    PermissionsBitField.resolve("KickMembers") ||
                    PermissionsBitField.resolve("ManageRoles") ||
                    PermissionsBitField.resolve("ManageChannels") ||
                    PermissionsBitField.resolve("ManageGuild") ||
                    PermissionsBitField.resolve("ManageEmojisAndStickers") ||
                    PermissionsBitField.resolve("ManageEvents") ||
                    PermissionsBitField.resolve("ManageGuildExpressions") ||
                    PermissionsBitField.resolve("ManageMessages") ||
                    PermissionsBitField.resolve("ManageThreads") ||
                    PermissionsBitField.resolve("ManageWebhooks") ||
                    PermissionsBitField.resolve("CreateEvents") ||
                    PermissionsBitField.resolve("CreateGuildExpressions") ||
                    PermissionsBitField.resolve("MentionEveryone") ||
                    PermissionsBitField.resolve("ModerateMembers") ||
                    PermissionsBitField.resolve("ViewCreatorMonetizationAnalytics") ||
                    PermissionsBitField.resolve("ViewGuildInsights") ||
                    PermissionsBitField.resolve("ViewAuditLog")]))
                    return message.channel.send(`${client.emoji.cross} | You can't add a role with dangerous permissions to the autorole list.`);

                if (autoroleHumans.includes(role.id))
                    return message.channel.send(`${client.emoji.cross} | This role is already present in the human autorole list.`);

                if (autoroleHumans.length > 5)
                    return message.channel.send(`${client.emoji.cross} | You can't have more than 5 autoroles.`);

                await autoroleHumans.push(role.id);
                await client.db.set(`autoroleHumans_${message.guild.id}`, autoroleHumans);

                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`${client.emoji.tick} | ${role} has been added to the human autorole list.`)
                    ]
                });
            } else if (args[1].toLowerCase() === "remove") {

                let roleID = message.mentions.roles.first()?.id || message.guild.roles.cache.get(args[2])?.id;

                let role = roleID ? await message.guild.roles.cache.get(roleID) : null;

                if (!role || !roleID)
                    return message.channel.send(`${client.emoji.cross} | Please mention a role provide a valid role id.`);

                if (!autoroleHumans.includes(role.id))
                    return message.channel.send(`${client.emoji.cross} | This role is not present in the human autorole list.`);

                await client.db.pull(`autoroleHumans_${message.guild.id}`, `${role.id}`);

                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`${client.emoji.tick} | ${role} has been removed from the human autorole list.`)
                    ]
                });
            } else if (args[1].toLowerCase() === "show" || args[1].toLowerCase() === "list") {

                if (autoroleHumans.length === 0)
                    return message.channel.send(`${client.emoji.cross} | There are no human autoroles to show.`);

                let humans = [];

                for (i = 0; i < autoroleHumans.length; i++) {
                    let role = await message.guild.roles.cache.get(autoroleHumans[i]);
                    humans.push(`\`[${i + 1}.]\` ${role} [${role.id}]\n`);
                }

                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setAuthor({
                                name: `${client.user.username} Human Autoroles`,
                                iconURL: client.user.displayAvatarURL({ dynamic: true })
                            })
                            .setThumbnail(message.guild.iconURL({ dynamic: true }))
                            .setFooter({
                                text: `Requested By ${message.author.tag}`,
                                iconURL: message.author.displayAvatarURL({ dynamic: true })
                            })
                            .addFields(
                                {
                                    name: `${client.emoji.dot} **Human Autoroles**`,
                                    value: humans.join("\n")
                                }
                            )
                    ]
                });
            } else if (args[1].toLowerCase() === "reset" || args[1].toLowerCase() === "clear") {
                if (autoroleHumans === null)
                    return message.channel.send(`${client.emoji.cross} | There are no human autoroles to reset.`);

                await client.db.delete(`autoroleHumans_${message.guild.id}`);
                return message.channel.send(`${client.emoji.tick} | Human Autoroles Have Been Reset.`)
            }
        }

        if (args[0].toLowerCase() === "bots" || args[0].toLowerCase() === "bot") {

            if (args[1].toLowerCase() === "add" || args[1].toLowerCase() === "set") {

                let roleID = message.mentions.roles.first()?.id || message.guild.roles.cache.get(args[2])?.id;

                let role = roleID ? await message.guild.roles.cache.get(roleID) : null;

                if (!role || !roleID)
                    return message.channel.send(`${client.emoji.cross} | Please mention a role provide a valid role id.`);

                if (role.managed === true)
                    return message.channel.send(`${client.emoji.cross} | You can't add an integrated role to the autorole list.`);

                if (role.permissions.has([
                    PermissionsBitField.resolve("Administrator") ||
                    PermissionsBitField.resolve("BanMembers") ||
                    PermissionsBitField.resolve("KickMembers") ||
                    PermissionsBitField.resolve("ManageRoles") ||
                    PermissionsBitField.resolve("ManageChannels") ||
                    PermissionsBitField.resolve("ManageGuild") ||
                    PermissionsBitField.resolve("ManageEmojisAndStickers") ||
                    PermissionsBitField.resolve("ManageEvents") ||
                    PermissionsBitField.resolve("ManageGuildExpressions") ||
                    PermissionsBitField.resolve("ManageMessages") ||
                    PermissionsBitField.resolve("ManageThreads") ||
                    PermissionsBitField.resolve("ManageWebhooks") ||
                    PermissionsBitField.resolve("CreateEvents") ||
                    PermissionsBitField.resolve("CreateGuildExpressions") ||
                    PermissionsBitField.resolve("MentionEveryone") ||
                    PermissionsBitField.resolve("ModerateMembers") ||
                    PermissionsBitField.resolve("ViewCreatorMonetizationAnalytics") ||
                    PermissionsBitField.resolve("ViewGuildInsights") ||
                    PermissionsBitField.resolve("ViewAuditLog")]))
                    return message.channel.send(`${client.emoji.cross} | You can't add a role with dangerous permissions to the autorole list.`);

                if (autoroleBots.includes(role.id))
                    return message.channel.send(`${client.emoji.cross} | This role is already present in the bot autorole list.`);

                if (autoroleBots.length > 3)
                    return message.channel.send(`${client.emoji.cross} | You can't have more than 3 autoroles.`);

                await autoroleBots.push(role.id);
                await client.db.set(`autoroleBots_${message.guild.id}`, autoroleBots);

                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`${client.emoji.tick} | ${role} has been added to the bot autorole list.`)
                    ]
                });
            } else if (args[1].toLowerCase() === "remove") {

                let roleID = message.mentions.roles.first()?.id || message.guild.roles.cache.get(args[2])?.id;

                let role = roleID ? await message.guild.roles.cache.get(roleID) : null;

                if (!role || !roleID)
                    return message.channel.send(`${client.emoji.cross} | Please mention a role provide a valid role id.`);

                if (!autoroleBots.includes(role.id))
                    return message.channel.send(`${client.emoji.cross} | This role is not present in the bot autorole list.`);

                await client.db.pull(`autoroleBots_${message.guild.id}`, `${role.id}`);

                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`${client.emoji.tick} | ${role} has been removed from the bot autorole list.`)
                    ]
                });
            } else if (args[1].toLowerCase() === "show" || args[1].toLowerCase() === "list") {

                if (autoroleBots.length === 0)
                    return message.channel.send(`${client.emoji.cross} | There are no bot autoroles to show.`);

                let bots = [];

                for (i = 0; i < autoroleBots.length; i++) {
                    let role = await message.guild.roles.cache.get(autoroleBots[i]);
                    bots.push(`\`[${i + 1}.]\` ${role} [${role.id}]\n`);
                }

                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setAuthor({
                                name: `${client.user.username} Bot Autoroles`,
                                iconURL: client.user.displayAvatarURL({ dynamic: true })
                            })
                            .setThumbnail(message.guild.iconURL({ dynamic: true }))
                            .setFooter({
                                text: `Requested By ${message.author.tag}`,
                                iconURL: message.author.displayAvatarURL({ dynamic: true })
                            })
                            .addFields(
                                {
                                    name: `${client.emoji.dot} **Bot Autoroles**`,
                                    value: bots.join("\n")
                                }
                            )
                    ]
                });
            } else if (args[1].toLowerCase() === "reset" || args[1].toLowerCase() === "clear") {
                if (autoroleBots === null)
                    return message.channel.send(`${client.emoji.cross} | There are no bot autoroles to reset.`);

                await client.db.delete(`autoroleBots_${message.guild.id}`);
                return message.channel.send(`${client.emoji.tick} | Bot Autoroles Have Been Reset.`)
            }
        }
    }
};