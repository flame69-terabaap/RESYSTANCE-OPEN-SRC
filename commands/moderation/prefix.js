const {
    Message,
    Client,
    EmbedBuilder,
    PermissionsBitField
} = require("discord.js");

module.exports = {
    name: "prefix",
    aliases: ["setprefix", "set-prefix"],
    category: "moderation",
    usage: "?prefix <new prefix>",
    description: "Change the prefix of the bot in your server.",
    cooldown: 10,

    run: async (client, message, args, prefix) => {

        if (!message.member.permissions.has(PermissionsBitField.resolve("ManageGuild")))
            return message.channel.send(`${client.emoji.cross} | You need \`Manage Server\` permission in order to use this command.`);

        if (!args[0])
            return message.channel.send(`${client.emoji.cross} | Please provide a new prefix for the bot.`);

        if (args[1])
            return message.channel.send(`${client.emoji.cross} | You can't set the prefix as double arguments..`);

        if (args[0].length > 3)
            return message.channel.send(`${client.emoji.cross} | You can't set the prefix for more than 3 characters.`);

        if (args.join('') === '?') {
            await client.db.delete(`prefix_${message.guild.id}`);
            return message.channel.send(`${client.emoji.tick} | Successfully reset the prefix to \`?\``);
        }

        await client.db.set(`prefix_${message.guild.id}`, args[0]);

        let pre = await client.db.get(`prefix_${message.guild?.id}`)
        if (pre === null)
            pre = '?';
        message.guild.prefix = pre;

        message.channel.send(`${client.emoji.tick} | Successfully set the prefix for this server to \`${pre}\``);
    }
}