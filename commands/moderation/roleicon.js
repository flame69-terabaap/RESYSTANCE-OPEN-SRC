const { EmbedBuilder } = require("@discordjs/builders");

module.exports = {
    name: "roleicon",
    aliases: ["seticon"],
    category: "moderation",
    description: "Sets a role's icon",
    usage: "?roleicon <role> <emoji/emoji_id/url>",
    cooldown: 5,

    run: async (client, message, args, prefix) => {

        const id = args[1]?.match(/<:[^:]+:(\d+)>/) || args[1]?.match(/<a:[^:]+:(\d+)>/) || args[1]?.match(/\/emojis\/(\d+)/) || args[1]?.split(' ');

        let roleid = message.mentions.roles.first()?.id || args[0] || message.guild.roles.cache.find((r) => r.name === args.slice(0).join( ' '))?.id;

        let role = roleid ? await message.guild.roles.fetch(roleid, { force: true }).catch(() => {}) : null;

        if (message.guild.premiumTier !== 2 && message.guild.premiumTier !== 3)
            return message.channel.send(`${client.emoji.cross} | This server must needs to have a booster level of \`2\` or above`);

        if (!role)
            return message.channel.send(`${client.emoji.cross} | Role not found`);

        if (!id)
            return message.channel.send(`${client.emoji.cross} | Invalid emoji`);

        try {
            await role.setIcon(`https://cdn.discordapp.com/emojis/${id[1]}.png`);
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`${client.emoji.tick} | Successfully edited the role icon for ${role}`)
                ]
            });
        } catch (error) {
            try {
                await role.setIcon(`https://cdn.discordapp.com/emoji/${id[1]}.gif`)
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`${client.emoji.tick} | Successfully edited the role icon for ${role}`)
                    ]
                });
            } catch (error) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`${client.emoji.cross} | An error occurred while editing the role icon for ${role}`)
                    ]
                });
            }
        }
    }
};