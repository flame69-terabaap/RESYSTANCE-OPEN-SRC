const { EmbedBuilder } = require("discord.js");

module.exports = async (client) => {
    client.on('guildDelete', async (guild) => {
        
        client.logger.log(`${client.user.username} Removed from : ${guild.name} | Members: ${guild.memberCount}`, 'log');

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({
                name: `${client.user.username} Removed From A Server`,
                iconURL: guild.iconURL()
            })
            .setTitle(`**${guild.name}**`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                {
                    name: `Guild Information`,
                    value: `Guild Name: ${guild.name}\nGuild ID: ${guild.id}\nGuild Created At: <t:${Math.round(guild.createdTimestamp / 1000)}:R>\nMember Count: ${guild.memberCount} Members`,
                    inline: false
                },
                {
                    name: `${client.user.username} Information`,
                    value: `Server Count: ${client.guilds.cache.size} Servers\nUsers Count: ${client.users.cache.size} Users`,
                    inline: false
                }
            )
    
        const web = client.webhook_guild_leave_logs;
    
        web.send({
            embeds: [embed]
        });
    });
};