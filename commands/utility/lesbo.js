const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "lesbo",
    category: "utility",
    description: "Check the lesbian percentage",
    usage: "?lesbo <user>",
    aliases: ["lesbian"],
    cooldown: 5,

    run: async (client, message, args, prefix) => {

        let target = message.mentions.members.first() || message.member;

        let percentage = Math.floor(Math.random() * 101);

        return message.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(`${client.color}`)
                .setTitle("Lesbian Percentage")
                .setDescription(`**${target.user.username}** is **${percentage}%** lesbian!`)
                .setFooter({
                    text: `Requested by ${message.author.tag}`,
                    iconURL: message.author.displayAvatarURL()
                })
            ]
        })
    }
};