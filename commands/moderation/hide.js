const {
    EmbedBuilder,
    Message,
    Client,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
    PermissionsBitField
} = require("discord.js");

module.exports = {
    name: "hide",
    aliases: [],
    category: "moderation",
    usage: "?hide <channel>",
    description: "Hides a channel for everyone",
    cooldown: 5,

    run: async (client, message, args, prefix) => {

        if (!message.member.permissions.has(PermissionsBitField.resolve("ManageChannels")))
            return message.channel.send(`${client.emoji.cross} | You need \`Manage Channels\` permission in order to use this command.`);
        if (!message.guild.members.me.permissions.has(PermissionsBitField.resolve("ManageChannels")))
            return message.channel.send(`${client.emoji.cross} | I need \`Manage Channels\` permission in order to execute this command.`);

        const channel = message.mentions.channels.first() ||
            message.guild.channels.cache.get(args[0]) || message.channel;
            
        const reason = args.slice(1).join(" ") || "No Reason Provided";
        const hideReason = `${message.author.tag} (${message.author.id}) | ${reason}`;


        if (channel.manageable) {
            channel.permissionOverwrites.edit(message.guild.id, {
                ViewChannel: false,
                reason: `${hideReason}`
            }).then(() => {
                message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`${client.emoji.tick} | Successfully hidden \`${channel.name}\` for @everyone role.`)
                    ]
                });
            }).catch(() => {
                message.channel.send(`${client.emoji.cross} | Failed to hide \`${channel.name}\`.`);
            });
        } else {
            message.channel.send(`${client.emoji.cross} | I don't have permission to hide \`${channel.name}\`.`);
        }
    }
}