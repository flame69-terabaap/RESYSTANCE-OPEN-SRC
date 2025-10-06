const {
    Message,
    Client,
    EmbedBuilder,
    PermissionsBitField
} = require("discord.js");

module.exports = {
    name: "role",
    aliases: ['r', "addrole"],
    category: "moderation",
    description: "Adds a role to a user",
    usage: "?role <user> <role>",
    cooldown: 5,

    run: async (client, message, args, prefix) => {
        
        const embed = new EmbedBuilder()
            .setColor(client.color)

        let serverOwner = (message.author.id === message.guild.ownerId);

        if (!message.member.permissions.has(PermissionsBitField.resolve("ManageRoles")))
            return message.channel.send(`${client.emoji.cross} | You neeed \`Manage Roles\` permission in order to use this command.`);

        if (!message.guild.members.me.permissions.has(PermissionsBitField.resolve("ManageRoles")))
            return message.channel.send(`${client.emoji.cross} | I need \`Manage Roles\` permission in order to execute this command.`);

        if (message.member.roles.highest.position <= message.guild.members.me.roles.highest.position && !serverOwner)
            return message.channel.send(`${client.emoji.cross} | You need to have a higher role than me in order to use this command.`);

        let member = message.guild.members.cache.get(args[0]) || message.mentions.members.first() || args[0]?.replace(/[^0-9]/g, "");

        if (!member)
            return message.channel.send(`${client.emoji.cross} | Please provide a valid user. Use the command correctly : \`${message.guild.prefix}role <user> <role>\``);

        let role = await findMatchingRoles(message.guild, args.slice(1).join(' '))

        role = role[0];
        if (!role)
            return message.channel.send(`${client.emoji.cross} | Please provide a valid role. Use the command correctly : \`${message.guild.prefix}role <user> <role>\``);

        if (role.managed)
            return message.channel.send(`${client.emoji.cross} | I can't add that role since it's managed by an Integration.`);

        if (role.position >= message.guild.members.me.roles.highest.position)
            return message.channel.send(`${client.emoji.cross} | I can't add that role since it's either equal to my role or higher than my top role.`);

        if (message.member.roles.highest.position <= role.position && !serverOwner)
            return message.channel.send(`${client.emoji.cross} | You need to have a higher role than the role you're trying to add.`);

        let hasRole = member.roles.cache.has(role.id)
        if (hasRole) {
            await member.roles.remove(role.id, `${message.author.tag}(${message.author.id}) | Removed the role.`);
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(`${client.emoji.tick} | Successfully removed <@&${role.id}> from <@${member.id}>.`)
                    ]
                });
            } else {
                await member.roles.add(role.id, `${message.author.tag}(${message.author.id}) | Added the role.`)
                return message.channel.send({
                    embeds: [
                        embed
                            .setColor(client.color)
                            .setDescription(`${client.emoji.tick} | Successfully added <@&${role.id}> to <@${member.id}>.`)
                    ]
                });
            } 
    }
};

function findMatchingRoles(guild, query) {
    const roleMention = /<?@?(\d{17,20})>?/;
    if (!guild || !query || typeof query !== 'string')
        return [];

    const matchedPattern = query.match(roleMention);
    if (matchedPattern) {
        const id = matchedPattern[1];
        const role = guild.roles.cache.find((r) => r.id === id)
        if (role)
            return [role];
    }

    const exact = [];
    const startsWith = [];
    const includes = [];

    guild.roles.cache.forEach((role) => {
        const lowercaseName = role.name.toLowerCase();
        if (role.name === query)
            exact.push(role);
        if (lowercaseName.startsWith(query.toLowerCase()))
            startsWith.push(role);
        if (lowercaseName.includes(query.toLowerCase()))
            includes.push(role);
    })
    if (exact.length > 0)
        return exact;
    if (startsWith.length > 0)
        return startsWith;
    if (includes.length > 0)
        return includes;
    return [];
}