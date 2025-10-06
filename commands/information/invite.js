const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = {
    name: "invite",
    aliases: ["inv", "botinvite", "vote", "support"],
    category: "information",
    cooldown: 8,

    run: async (client, message, args, prefix) => {
        const invite = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel("Invite Me")
            .setURL(`${client.invite}`);

        // const vote = new ButtonBuilder()
        //     .setStyle(ButtonStyle.Link)
        //     .setLabel("Vote Me")
        //     .setURL(`${client.vote}`);

        const support = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel("Support Server")
            .setURL(`${client.support}`);

        const row = new ActionRowBuilder()
            .addComponents(invite, support)

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `| ${message.author.tag}`,
                iconURL: `${message.author.displayAvatarURL({ dynamic: true })}`
            })
            .setColor(client.color)
            .setDescription(`${client.emoji.dot} [Click the link to invite the bot to your server.](${client.invite})\n${client.emoji.dot} [Click the link to join the support server of the bot.](${client.support})`)
            .setFooter({
                text: `Made With ❤️ By ${client.user.username} Developers.`,
                iconURL: `${client.user.displayAvatarURL({ dynamic: true })}`
            })
            .setTimestamp();

        message.channel.send({
            embeds: [embed],
            components: [row]
        });
    }
}