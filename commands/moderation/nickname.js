module.exports = {
    name: "nickname",
    aliases: ["nick", "setnick", "setnickname"],
    category: "moderation",
    usage: "?nick <user> [nickname]",
    description: "Changes the nickname of a member.",
    cooldown: 5,

    run: async (client, message, args, prefix) => {

        let nick = args.slice(1).join(" ");

        let id = message.mentions.members.first()?.user.id || args[0];

        let member = id ? await message.guild.members.fetch(id, { force: true }).catch((err) => {}) : null;

        if (!member)
            return message.channel.send(`${client.emoji.cross} | Please provide a valid member.`);

        if (member.id === client.user.id)
            return message.channel.send(`${client.emoji.cross} | You wanna change my nickame? Put some effort and go change it yourself :skull:.`);

        if (member.id === message.guild.ownerId)
            return message.channel.send(`${client.emoji.cross} | You can't change the nickname of the server owner.`);

        if (member.id === message.author.id)
            return message.channel.send(`${client.emoji.cross} | You can't change your own nickname.`);

        if (member.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.ownerId)
            return message.channel.send(`${client.emoji.cross} | Your top role should be above the top role of the member whose nickname you wanna change.`);

        if (message.guild.members.me.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.ownerId)
            return message.channel.send(`${client.emoji.cross} | Your top role should be above my top role if you wanna change the nickname of that member.`);

        await member.setNickname(nick)

        message.channel.send(`${client.emoji.tick} | Successfully changed the nickname of <@${member.user.id}>.`);
    }
}