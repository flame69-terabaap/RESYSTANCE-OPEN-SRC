const { EmbedBuilder } = require("discord.js");
const db = require("../../schema/afk");

module.exports = {
    name: "afk",
    description: "Sets you Away From Keyboard",
    category: "utility",
    usage: "?afk [reason]",
    aliases: ["awayfromkeys"],
    cooldown: 10,

    run: async (client, message, args, prefix) => {
        const data = await db.findOne({
            Guild: message.guildId,
            Member: message.author.id
        });
        const reason = args.join(" ") ? args.join(" ") : "I am AFK";

        if (data) {
            const emb = new EmbedBuilder()
                .setTitle(":clown: You are already AFK!")
                .setColor(client.color)
            return message.channel.send({
                embeds: [emb]
            });
        } else {
            const newData = new db({
                Guild: message.guildId,
                Member: message.author.id,
                Reason: reason,
                Time: Date.now()
            })

            await newData.save();

            const emb = new EmbedBuilder()
                .setDescription(`Your AFK has been set to : *${reason}*`)
                .setColor(client.color)
            return message.channel.send({
                embeds: [emb]
            });
        }
    }
};