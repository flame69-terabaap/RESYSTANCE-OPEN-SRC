const { PermissionsBitField } = require("discord.js")

module.exports = {
    name: "addemoji",
    aliases: ["emojiadd", "ae", "aemoji"],
    category: "moderation",
    description: "Adds an emoji to your server.",
    usage: "?addemoji <emoji> <name>",
    cooldown: 5,

    run: async (client, message, args, prefix) => {

        if (!message.member.permissions.has(PermissionsBitField.resolve("ManageEmojisAndStickers")))
            return message.channel.send(`${client.emoji.cross} | You need the \`Manage Emojis\` permission to use this command`);

        if (!message.guild.members.me.permissions.has(PermissionsBitField.resolve("ManageEmojisAndStickers")))
            return message.channel.send(`${client.emoji.cross} | I need the \`Manage Emojis\` permission to execute this command`);

        const refMsgID = message.reference?.messageId;
        const ref = message.channel.messages.cache.get(refMsgID);
        const refEmoji = ref?.content?.match(/<a?:\w+:(\d+)>/);

        if (!refEmoji) {
            let emoji = args[0];
            if (emoji) {
                let emojiID = null;

                try {
                    emojiID = emoji.match(/([0-9]+)/)[0];
                } catch (err) {}

                if (emojiID) {
                    let name = args[1] || `${client.user.username}_stolen_emoji`;
                    let link = `https://cdn.discordapp.com/emojis/${emojiID}`;

                    try {
                        await message.guild.emojis.create({
                            attachment: `${link}`,
                            name: `${name}`,
                            reason: `${message.author.username} (${message.author.id})`
                        }).then((newEmoji) => {
                            return message.channel.send(`${client.emoji.tick} | Successfully added the emoji ${newEmoji} to this server.`);
                        }).catch(() => {}); 
                    } catch (err) {
                        return message.channel.send(`${client.emoji.cross} | An error occurred while adding the emoji to this server.`);
                    }
                } else {
                    return message.channel.send(`${client.emoji.cross} | An invalid emoji was provided.`);
                }
            } else {
                return message.channel.send(`${client.emoji.cross} | Please provide an emoji to add to this server.`);
            }
        }

        const refEmojiID = refEmoji[1];
        const refEmojiName = `${client.user.username}Emoji_${refEmoji[0].split(":")[1]}`;

        try {
            await message.guild.emojis.create({
                attachment: `https://cdn.discordapp.com/emojis/${refEmojiID}`,
                name: `${refEmojiName}`,
                reason: `${message.author.username} (${message.author.id})`
            }).then((newEmoji) => {
                return message.channel.send(`${client.emoji.tick} | Successfully added the emoji ${newEmoji} to this server.`);
            }).catch(() => {});
        } catch (error) {
            return message.channel.send(`${client.emoji.cross} | An error occurred while adding the emoji to this server.`);
        }
    }
};