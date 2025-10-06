const { PermissionsBitField } = require("discord.js");

module.exports = {
    name: "vcdeafenall",
    aliases: ["vcdeafall", "voicedeafenall", "voicedeafall"],
    description: "Deafen all members in the voice channel.",
    usage: "?vcdeafenall",
    category: "voice",
    cooldown: 7,

    run: async (client, message, args, prefix) => {

        if (!message.member.voice.channel)
            return message.channel.send(`${client.emoji.cross} | You need to be connected to a voice channel in order to use this command.`);

        if (!message.member.permissions.has(PermissionsBitField.resolve("DeafenMembers")))
            return message.channel.send(`${client.emoji.cross} | You need \`Deafen Members\` permission to use this command.`);

        if (!message.guild.members.me.permissions.has(PermissionsBitField.resolve("DeafenMembers")))
            return message.channel.send(`${client.emoji.cross} | I need \`Deafen Members\` permission to execute this command.`);

        try {
            let i = 0;

            message.member.voice.channel.members.forEach(async (member) => {
                i++;
                await member.voice.setDeaf(true, `${message.author.tag} (${message.author.id})`);
                await client.utils.sleep(1000);
            });

            message.channel.send(`${client.emoji.tick} | Successfully deafened all ${i} members in the voice channel.`);
        } catch (err) {
            message.channel.send(`${client.emoji.cross} | An error occured while trying to deafen all the members in the voice channel.`)
        }
    }
};