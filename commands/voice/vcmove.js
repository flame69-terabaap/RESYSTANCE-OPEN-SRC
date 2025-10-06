const { PermissionsBitField } = require("discord.js");

module.exports = {
    name: "vcmove",
    aliases: ["vm", "voicemove"],
    category: "voice",
    description: "Moves the mentioned member to the mentioned voice channel.",
    usage: "?vcmove <user> <voicechannel>",
    cooldown: 5,

    run: async (client, message, args, prefix) => {

        const moveChannel = message.guild.channels.cache.get(args[1]);

        if (!message.member.voice.channel)
            return message.channel.send(`${client.emoji.cross} | You need to be connected to a voice channel in order to use this command.`);

        let id = message.mentions.members.first()?.user.id || args[0];

        let member = id ? await message.guild.members.fetch(id, { force: true }).catch((err) => {}) : null;
        if (!member)
            return message.channel.send(`${client.emoji.cross} | You need to mention a member to move them to a voice channel.`);

        if (!message.member.permissions.has(PermissionsBitField.resolve("MoveMembers")))
            return message.channel.send(`${client.emoji.cross} | You need \`Move Members\` permission to use this command.`);

        if (!message.guild.members.me.permissions.has(PermissionsBitField.resolve("MoveMembers")))
            return message.channel.send(`${client.emoji.cross} | I need \`Move Members\` permission to execute this command.`);

        if (!member.voice.channel)
            return message.channel.send(`${client.emoji.cross} | The mentioned member is not connected to a voice channel.`);

        if (member.voice.channel.id === moveChannel.id)
            return message.channel.send(`${client.emoji.cross} | The mentioned member is already connected to the mentioned voice channel.`);

        member.voice.setChannel(moveChannel);
        message.channel.send(`${client.emoji.tick} | Successfully moved ${member.user.username} to ${moveChannel.name}.`);
    }
};