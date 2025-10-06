const { PermissionsBitField } = require("discord.js");

module.exports = {
    name: "vcpull",
    aliases: ["vp", "voicepull"],
    category: "voice",
    description: "Moves the mentioned member to your voice channel.",
    usage: "?vcpull <user>",
    cooldown: 5,

    run: async (client, message, args, prefix) => {

        if (!message.member.voice.channel)
            return message.channel.send(`${client.emoji.cross} | You need to be connected to a voice channel in order to use this command.`);

        let id = message.mentions.members.first()?.user.id || args[0];

        let member = id ? await message.guild.members.fetch(id, { force: true }).catch((err) => {}) : null;
        if (!member)
            return message.channel.send(`${client.emoji.cross} | You need to mention a member to move them to your voice channel.`);

        if (!message.member.permissions.has(PermissionsBitField.resolve("MoveMembers")))
            return message.channel.send(`${client.emoji.cross} | You need \`Move Members\` permission to use this command.`);

        if (!message.guild.members.me.permissions.has(PermissionsBitField.resolve("MoveMembers")))
            return message.channel.send(`${client.emoji.cross} | I need \`Move Members\` permission to execute this command.`);

        if (!member.voice.channel)
            return message.channel.send(`${client.emoji.cross} | The mentioned member is not connected to a voice channel.`);

        if (member.voice.channel.id === message.member.voice.channel.id)
            return message.channel.send(`${client.emoji.cross} | The mentioned member is already connected to your voice channel.`);

        member.voice.setChannel(message.member.voice.channel);
        message.channel.send(`${client.emoji.tick} | Successfully moved ${member.user.username} to your voice channel.`);
    }
};