const { PermissionsBitField } = require("discord.js");

module.exports = {
    name: "vcunmute",
    aliases: ["vunmute", "voiceunmute"],
    category: "voice",
    description: "Unmutes a member present in the voice channel.",
    usage: "?vcunmute <@user>",
    cooldown: 5,

    run: async (client, message, args, prefix) => {

        if (!message.member.voice.channel)
            return message.channel.send(`${client.emoji.cross} | You need to be connected to a voice channel in order to use this command.`);

        let id = message.mentions.members.first()?.user.id || args[0];

        let member = id ? await message.guild.members.fetch(id, { force: true }).catch((err) => {}) : null;
        if (!member)
            return message.channel.send(`${client.emoji.cross} | You need to mention a member to mute in a voice channel.`);

        if (!message.member.permissions.has(PermissionsBitField.resolve("MuteMembers")))
            return message.channel.send(`${client.emoji.cross} | You need \`Mute Members\` permission to use this command.`);

        if (!message.guild.members.me.permissions.has(PermissionsBitField.resolve("MuteMembers")))
            return message.channel.send(`${client.emoji.cross} | I need \`Mute Members\` permission to execute this command.`);

        if (!member.voice.channel)
            return message.channel.send(`${client.emoji.cross} | The mentioned member is not connected to a voice channel.`);

        if (member.voice.serverMute === false)
            return message.channel.send(`${client.emoji.cross} | The mentioned member is not muted in the voice channel.`);

        member.voice.setMute(false);
        message.channel.send(`${client.emoji.tick} | Successfully unmuted ${member.user.username} in the voice channel.`);
    }
};