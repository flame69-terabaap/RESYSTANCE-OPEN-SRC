const {
    Message,
    Client,
    EmbedBuilder,
    PermissionsBitField,
} = require("discord.js");

module.exports = {
    name: "ban",
    aliases: ["hackban"],
    category: "moderation",
    description: "Bans a member from the server.",
    usage: `?ban <member> [reason]`,
    cooldown: 5,

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args
     * @param {String} prefix
     */

    run: async (client, message, args, prefix) => {

        if (!args[0])
            return message.channel.send(
                `Please provide a member to ban. Usage: \`${prefix}ban <member> [reason]\``
            );

        if (!message.member.permissions.has(PermissionsBitField.resolve("BanMembers")))
            return message.channel.send(`${client.emoji.cross} | You need \`Ban Members\` permission in order to use this command.`);

        if (!message.guild.members.me.permissions.has(PermissionsBitField.resolve("BanMembers")))
            return message.channel.send(`${client.emoji.cross} | I need \`Ban Members\` permission in order to execute this command.`);

        const id = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || client.users.fetch(args[0]);

        if (!id)
            return message.channel.send(`${client.emoji.cross} | Please provide a valid member to ban.`);

        if (id.id === message.author.id)
            return message.channel.send(`${client.emoji.cross} | You can't ban yourself.`);

        if (id.id === client.user.id)
            return message.channel.send(`${client.emoji.cross} | You can't ban me.`);

        if (!id.bannable)
            return message.channel.send(`${client.emoji.cross} | I can't ban this user.`);

        if (id.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.ownerId)
            return message.channel.send(`${client.emoji.cross} | Your top role should be above the top role of the member you want to ban.`);

        if (message.member.roles.highest.position <= message.guild.members.me.roles.highest.position && message.author.id !== message.guild.ownerId)
            return message.channel.send(`${client.emoji.cross} | Your top role should be above my top role if you wanna ban this user.`);

        let reason = args.slice(1).join(" ") || "No Reason Provided";
        let banReason = `${message.author.tag} (${message.author.id}) | ${reason}`;

        try {

            //let dmMember = client.users.fetch(id.id, true);

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `Member Banned`,
                    icon: id.user.displayAvatarURL() ? id.user.displayAvatarURL() : message.guild.iconURL({ dynamic: true })
                })
                .setThumbnail(`${message.author.displayAvatarURL({ dynamic: true })}`)
                .setColor(client.color)
                .addFields({
                    name: `Member Banned : `,
                    value: `${id.user.tag} (${id.user.id})`,
                    inline: true
                },
                {
                    name: `Moderator : `,
                    value: `${message.author.tag} (${message.author.id})`,
                    inline: true
                },
                {
                    name: `Reason : `,
                    value: banReason,
                    inline: false
                })
                .setFooter({
                    text: `Developed With ❤️ By ${client.user.username} Developers.`,
                    iconURL: client.user.displayAvatarURL({ dynamic: true })
                })
                .setTimestamp();

            id.send({
                content: `You Have Been Banned From ${message.guild.name}.`,
                embeds: [embed]
            }).catch((_) => {})

            await message.guild.bans.create(id.id,{
                reason: banReason
            }
            );

            message.channel.send(`${client.emoji.tick} | Successfully Banned <@${id.id}> for reason: \`${banReason}\`.`);
        } catch (error) {
            console.error(error);
            await client.webhook_error_logs.send(
                `**\`BAN Command Error\`**\n\`\`\`js\n${error.stack}\`\`\``
            );
            //message.channel.send(`${client.emoji.cross} | I cannot ban this member.`);
        }
    }
};