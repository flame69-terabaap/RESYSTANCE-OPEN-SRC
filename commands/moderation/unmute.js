const {
    EmbedBuilder,
    PermissionsBitField
} = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "unmute",
    aliases: ["untimeout"],
    category: "moderation",
    usage: "?unmute <user> [reason]",
    description: "Timeouts a member in the server.",
    cooldown: 5,

    run: async (client, message, args, prefix) => {

        let id = message.mentions.members.first()?.user.id || args[0]?.replace(/[^0-9]/g, "");

        let member = id ? await message.guild.members.fetch(id, { force: true }).catch(() => {}) : null;

        if (!member)
            return message.channel.send(`${client.emoji.cross} | Please provide a valid member to unmute.`);

        if (member.id === client.user.id)
            return message.channel.send(`${client.emoji.cross} | How would I be able to chat if I was muted? Kindly have some common sense!`);

        if (member.id === message.author.id)
            return message.channel.send(`${client.emoji.cross} | Kindly have some common sense!`);

        if (member.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.ownerId)
            return message.channel.send(`${client.emoji.cross} | Your top role must be above the top role of the member you wanna unmute.`);

        if (message.member.roles.highest.position <= message.guild.members.me.roles.highest.position && message.author.id !== message.guild.ownerId)
            return message.channel.send(`${client.emoji.cross} | Your top role should be above my top role if you wanna unmute that member.`);

        if (!member.manageable)
            return message.channel.send(`${client.emoji.cross} | I unable to unmute this user, kindly check my the required role hierarchy and permission.`);

        if (!message.member.permissions.has(PermissionsBitField.resolve("ModerateMembers")))
            return message.channel.send(`${client.emoji.cross} | You need \`Timeout Members\` permission in order to run this command.`)

        if (!message.member.guild.members.me.permissions.has(PermissionsBitField.resolve("ModerateMembers")))
            return message.channel.send(`${client.emoji.cross} | I need \`Timeout Members\` permission in order to execute this command.`);


        let reason = args.slice(1).join(" ") || "No Reason Provided";
        let unmuteReason = `${message.author.tag} (${message.author.id}) | ${reason}`;

        let muteAction = await member.timeout(null, unmuteReason).catch((err) => {
            message.channel.send(`${client.emoji.cross} | Failed to unmute the member, ${err}`);
            return false;
        });

        if (muteAction) {
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`${client.emoji.tick} | Successfully unmuted ${member.user.username}.`)
                        .addFields({
                            name: `Reason : `,
                            value: `${unmuteReason}`
                        })
                ]
            });
        }
    }
}