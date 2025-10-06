const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "gay",
    aliases: ["gayrate"],
    category: "utility",
    description: "Check the gayness percentage",
    usage: "?gay <user>",
    cooldown: 5,

    run: async (client, message, args, prefix) => {

        let target = message.mentions.members.first() || message.member;
        let gayness = Math.floor(Math.random() * 101);

        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({
                        name: `${target.user.username}'s Gayness Rate`,
                        iconURL: target.user.displayAvatarURL({ dynamic: true })
                    })
                    .setDescription(
                        `${target.user.username} is ${gayness}% gay!!`
                    )
                    .setFooter({
                        text: `Requested By ${message.author.username}`,
                        iconURL: message.author.displayAvatarURL({ dynamic: true })
                    })
            ]
        })
    }
};