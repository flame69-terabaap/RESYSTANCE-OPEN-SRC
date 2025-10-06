const {
    Message,
    Client,
    EmbedBuilder,
    PermissionsBitField,
} = require("discord.js");

module.exports = {
    name: "unban",
    aliases: ["ub"],
    category: "moderation",
    description: "Unbans a member from the server.",
    usage: `?unban <member> [reason]`,
    cooldown: 5,

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args
     * @param {String} prefix
     */

    run: async (client, message, args, prefix) => {

        if (!message.member.permissions.has(PermissionsBitField.resolve("BanMembers")))
            return message.channel.send(`${client.emoji.cross} | You need \`Ban Members\` permission in order to use this command.`);

        if (!message.guild.members.me.permissions.has(PermissionsBitField.resolve("BanMembers")))
            return message.channel.send(`${client.emoji.cross} | I need \`Ban Members\` permission in order to execute this command.`);

        if (message.member.roles.highest.position <= message.guild.members.me.roles.highest.position && message.author.id !== message.guild.ownerId)
            return message.channel.send(`${client.emoji.cross} | Your top role should be above my top role if you wanna ban this user.`);


        const id = args[0];

        if (id === message.author.id)
            return message.channel.send(`${client.emoji.cross} | How can you unban yourself from a server, you are already present in? Kindly have some common sense!.`);

        if (id === client.user.id)
            return message.channel.send(`${client.emoji.cross} | Kindly have some common sense!`);

        if (!id) {
            return message.channel.send(`${client.emoji.cross} | Please provide a valid id of the member to unban.`);
        } else {
            
            try {            
                if (message.guild.members.cache.get(id)) {
                    return message.channel.send(`${client.emoji.cross} | This member is already present in the server.`);
                } else {
                    await message.guild.members.unban(`${id}`).then(() => {
                        return message.channel.send(`${client.emoji.tick} | Successfully Unbanned \`${id}\`.`);
                    }).catch((error) => {
                        console.error(error);
                        return message.channel.send(`${client.emoji.cross} | I couldn't unban that member.`);
                    });
                }
            } catch (error) {
            console.error(error);
            await client.webhook_error_logs.send(
                `**\`UNBAN Command Error\`**\n\`\`\`js\n${error.stack}\`\`\``
            );
        }
    }
}
};