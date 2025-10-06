const { PermissionsBitField } = require("discord.js");

module.exports = {
    name: "vckick",
    aliases: ["voicekick"],
    category: "voice",
    description: "Disconnects the mentioned member from a voice channel.",
    usage: "?vckick <@user>",
    cooldown: 5,

    run: async (client, message, args, prefix) => {

        if (!message.member.voice.channel)
            return message.channel.send(`${client.emoji.cross} | You need to be connected to a voice channel in order to use this command.`);

        let id = message.mentions.members.first()?.user.id || args[0];

        let member = id ? await message.guild.members.fetch(id, { force: true }).catch((err) => {}) : null;
        if (!member)
            return message.channel.send(`${client.emoji.cross} | You need to mention a member to kick from the voice channel.`);

        if (!message.member.permissions.has(PermissionsBitField.resolve("MoveMembers")))
            return message.channel.send(`${client.emoji.cross} | You need \`Move Members\` permission to use this command.`);

        if (!message.guild.members.me.permissions.has(PermissionsBitField.resolve("MoveMembers")))
            return message.channel.send(`${client.emoji.cross} | I need \`Move Members\` permission to execute this command.`);

        if (!member.voice.channel)
            return message.channel.send(`${client.emoji.cross} | The mentioned member is not connected to a voice channel.`);

        member.voice.disconnect();
        message.channel.send(`${client.emoji.tick} | Successfully disconnected ${member.user.username} from the voice channel.`);
    }
};