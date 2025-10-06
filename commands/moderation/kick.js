const {
    Message,
    Client,
    EmbedBuilder,
    PermissionsBitField,
} = require("discord.js");

module.exports = {
    name: "kick",
    aliases: [],
    category: "moderation",
    description: "Kicks a member from the server.",
    usage: `?kick <member> [reason]`,
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
                `Please provide a member to kick. Usage: \`${prefix}kick <member> [reason]\``
            );

        if (!message.member.permissions.has(PermissionsBitField.resolve("KickMembers")))
            return message.channel.send(`${client.emoji.cross} | You need \`Kick Members\` permission in order to use this command.`);

        if (!message.guild.members.me.permissions.has(PermissionsBitField.resolve("KickMembers")))
            return message.channel.send(`${client.emoji.cross} | I need \`Kick Members\` permission in order to execute this command.`);

        const id = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!id)
            return message.channel.send(`${client.emoji.cross} | Please provide a valid member to kick.`);

        if (id.id === message.author.id)
            return message.channel.send(`${client.emoji.cross} | You can't kick yourself.`);

        if (id.id === client.user.id)
            return message.channel.send(`${client.emoji.cross} | You can't kick me.`);

        if (!id.kickable)
            return message.channel.send(`${client.emoji.cross} | I can't kick this user.`);

        if (id.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.ownerId)
            return message.channel.send(`${client.emoji.cross} | Your top role should be above the top role of the member you want to kick.`);

        if (message.member.roles.highest.position <= message.guild.members.me.roles.highest.position && message.author.id !== message.guild.ownerId)
            return message.channel.send(`${client.emoji.cross} | Your top role should be above my top role if you wanna kick this user.`);

        let reason = args.slice(1).join(" ") || "No Reason Provided";
        let kickReason = `${message.author.tag} (${message.author.id}) | ${reason}`;

        try {

            //let dmMember = client.users.fetch(id.id, true);

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `Member Kicked`,
                    icon: id.user.displayAvatarURL() ? id.user.displayAvatarURL() : message.guild.iconURL({ dynamic: true })
                })
                .setThumbnail(`${message.author.displayAvatarURL({ dynamic: true })}`)
                .setColor(client.color)
                .addFields({
                    name: `Member Kicked : `,
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
                    value: kickReason,
                    inline: false
                })
                .setFooter({
                    text: `Developed With ❤️ By ${client.user.username} Developers.`,
                    iconURL: client.user.displayAvatarURL({ dynamic: true })
                })
                .setTimestamp();

            id.send({
                content: `You Have Been Kicked From ${message.guild.name}.`,
                embeds: [embed]
            }).catch((_) => {})

            await id.kick(kickReason);

            message.channel.send(`${client.emoji.tick} | Successfully Kicked <@${id.id}> for reason: \`${kickReason}\`.`);
        } catch (error) {
            console.error(error);
            await client.webhook_error_logs.send(
                `**\`KICK Command Error\`**\n\`\`\`js\n${error.stack}\`\`\``
            );
            //message.channel.send(`${client.emoji.cross} | I cannot ban this member.`);
        }
    }
};