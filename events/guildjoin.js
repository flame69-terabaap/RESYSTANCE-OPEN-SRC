const { EmbedBuilder,ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = async (client) => {
    client.on('guildCreate', async (guild) => {
        client.db.set(`prefix_${guild.id}`, client.prefix);

        client.logger.log(`${client.user.username} Added to : ${guild.name} | Members: ${guild.memberCount}`, 'log');

        const web = client.webhook_guild_join_logs;

        let msgChannel;
        if (!msgChannel)
            return;

        let embb = new EmbedBuilder()
            .setColor(client.color)
            .setTitle(`Hey, I am ${client.user.username}!`)
            .setAuthor({
                name: `Thank you for inviting me to ${guild.name}!`,
                iconURL: `${client.user.displayAvatarURL({ dynamic: true })}`
            })
            .setDescription(`My default prefix: \`${client.config.prefix}\`
                > I provide you with a lot of features in order to enhance your community management.`
            )
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setTimestamp()

        let b1 = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel(`Support Server`)
            .setURL(`${client.support}`)

        let b2 = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel(`Invite ${client.user.username}`)
            .setURL(`${client.invite}`)

        let row = new ActionRowBuilder()
            .addComponents(b1, b2)

        if (msgChannel)
            msgChannel.send({
                embeds: [embb],
                components: [row]
            });

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({
                name: `${client.user.username} Has Been Added To A New Server!`,
                iconURL: `${client.user.displayAvatarURL({ dynamic: true })}`
            })
            .setTitle(`**${guild.name}**`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                {
                    name: `Guild Information`,
                    value: `Guild Name : ${guild.name}\nGuild ID: ${guild.id}\nGuild Created At: <t:${Math.round(guild.createdTimestamp / 1000)}> (<t:${Math.round(guild.createdTimestamp / 1000)}:R>)\nGuild Joined At: <t:${Math.round(guild.joinedTimestamp / 1000)}> (<t:${Math.round(guild.joinedTimestamp / 1000)}:R>)\nGuild Member Count: ${guild.memberCount}`,
                    inline: false
                }
            )
            .setImage(guild.bannerURL({ dynamic: true }))

        web.send({
            embeds: [embed]
        })
    });
};