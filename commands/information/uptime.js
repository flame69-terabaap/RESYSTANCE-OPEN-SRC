const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "uptime",
    category: "information",
    aliases: ["up"],
    usage: "?uptime",
    description: "Shows the bot's uptime",
    cooldown: 6,

    run: async (client, message, args, prefix) => {

        let days = Math.floor(client.uptime / 86400000);
        let hours = Math.floor(client.uptime / 3600000) % 24;
        let minutes = Math.floor(client.uptime / 60000) % 60;
        let seconds = Math.floor(client.uptime / 1000) % 60;
        
        let uptime = `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;

        const em = new EmbedBuilder()
            .setAuthor({
                name: `${client.user.username}'s Uptime`,
                iconURL: client.user.displayAvatarURL()
            })
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(`\`${uptime}\``)
            .setColor(client.color)
            .setTimestamp()

        return message.channel.send({
            embeds: [em]
        });
    }
};