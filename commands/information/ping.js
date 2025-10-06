const { EmbedBuilder } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
    name: "ping",
    aliases: ["latency"],
    category: "information",
    description: "Shows the bot's ping.",
    usage: "?ping",
    cooldown: 8,

    run: async (client, message, args, prefix) => {
        /*const msg = await message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: `| Loading! Please wait.....`,
                        iconURL: `${message.author.displayAvatarURL({ dynamic: true })}`
                    })
                    .setColor(client.color)
            ]
        });*/
        
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({
                        name: `${client.user.username}'s Ping!`,
                        iconURL: `${message.author.displayAvatarURL({ dynamic: true })}`
                    })
                    .addFields({
                        name: `Message Ping : `,
                        value: `\`\`\`yaml\n${(Date.now() - message.createdTimestamp).toFixed(2)}ms\`\`\``,
                        inline: false
                    },
                    {
                        name: `Database Ping : `,
                        value: `\`\`\`yaml\n${(await client.db.ping()).toFixed(2)}ms\`\`\``,
                        inline: false
                    },
                    {
                        name: `API Ping : `,
                        value: `\`\`\`yaml\n${(client.ws.ping).toFixed(2)}ms\`\`\``,
                        inline: false
                    })
            ]
        });
    }
}