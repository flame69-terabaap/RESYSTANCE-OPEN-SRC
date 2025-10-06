const { PermissionsBitField } = require("discord.js");

module.exports = {
    name: "vcundeafen",
    aliases: ["vcundeaf", "voiceundeafen"],
    category: "voice",
    description: "Undeafens a member present in the voice channel.",
    usage: "?vcundeafen <@user>",
    cooldown: 5,

    run: async (client, message, args, prefix) => {

        if (!message.member.voice.channel)
            return message.channel.send(`${client.emoji.cross} | You need to be connected to a voice channel in order to use this command.`);

        let id = message.mentions.members.first()?.user.id || args[0];

        let member = id ? await message.guild.members.fetch(id, { force: true }).catch((err) => {}) : null;
        if (!member)
            return message.channel.send(`${client.emoji.cross} | You need to mention a member to deafen in a voice channel.`);

        if (!message.member.permissions.has(PermissionsBitField.resolve("DeafenMembers")))
            return message.channel.send(`${client.emoji.cross} | You need \`Deafen Members\` permission to use this command.`);

        if (!message.guild.members.me.permissions.has(PermissionsBitField.resolve("DeafenMembers")))
            return message.channel.send(`${client.emoji.cross} | I need \`Deafen Members\` permission to execute this command.`);

        if (!member.voice.channel)
            return message.channel.send(`${client.emoji.cross} | The mentioned member is not connected to a voice channel.`);

        if (member.voice.serverDeaf === false)
            return message.channel.send(`${client.emoji.cross} | The mentioned member is not deafened in the voice channel.`);

        member.voice.setDeaf(false);
        message.channel.send(`${client.emoji.tick} | Successfully undeafened ${member.user.username} in the voice channel.`);
    }
};