const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "membercount",
    aliases: ["members"],
    description: "Shows the member count of the server",
    category: "utility",
    cooldown: 8,

    run: async (client, message, args, prefix) => {

        let embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({
                name: `${message.guild.name}'s Member Count`,
                iconURL: message.guild.iconURL({ dynamic: true })
            })
            .setFooter({
                text: `Requested By ${message.author.username}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
            // .setThumbnail({
            //     url: `${message.guild.iconURL({ dynamic: true })}`

            // })
            .setDescription(`Total Members: ${message.guild.memberCount}`)

        message.channel.send({
            embeds: [
                embed
            ]
        });
    }
};