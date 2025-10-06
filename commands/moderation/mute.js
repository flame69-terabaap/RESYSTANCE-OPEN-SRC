const {
    EmbedBuilder,
    PermissionsBitField
} = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "mute",
    aliases: ["timeout"],
    category: "moderation",
    usage: "?mute <user> [duration] [reason]",
    description: "Timeouts a member in the server.",
    cooldown: 5,

    run: async (client, message, args, prefix) => {

        let id = message.mentions.members.first()?.user.id || args[0]?.replace(/[^0-9]/g, "");

        let member = id ? await message.guild.members.fetch(id, { force: true }).catch(() => {}) : null;

        if (!member)
            return message.channel.send(`${client.emoji.cross} | Please provide a valid member to mute.`);

        if (member.id === client.user.id)
            return message.channel.send(`${client.emoji.cross} | I can't mute myself.`);

        if (member.id === message.author.id)
            return message.channel.send(`${client.emoji.cross} | You can't mute yourself.`);

        if (member.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.ownerId)
            return message.channel.send(`${client.emoji.cross} | Your top role must be above the top role of the member you wanna mute.`);

        if (message.member.roles.highest.position <= message.guild.members.me.roles.highest.position && message.author.id !== message.guild.ownerId)
            return message.channel.send(`${client.emoji.cross} | Your top role should be above my top role if you wanna mute that member.`);

        if (!member.manageable)
            return message.channel.send(`${client.emoji.cross} | I unable to mute this user, kindly check my the required role hierarchy and permission.`);

        if (!message.member.permissions.has(PermissionsBitField.resolve("ModerateMembers")))
            return message.channel.send(`${client.emoji.cross} | You need \`Timeout Members\` permission in order to run this command.`)

        if (!message.member.guild.members.me.permissions.has(PermissionsBitField.resolve("ModerateMembers")))
            return message.channel.send(`${client.emoji.cross} | I need \`Timeout Members\` permission in order to execute this command.`);

        let time = args[1];

        if (!time)
            time = "27d";

        let duration = ms(time);

        let reason = args.slice(2).join(" ") || "No Reason Provided";
        let muteReason = `${message.author.tag} (${message.author.id}) | ${reason}`;

        let muteAction = await member.timeout(duration, muteReason).catch((err) => {
            message.channel.send(`${client.emoji.cross} | Failed to mute the member, ${err}`);
            return false;
        });

        if (muteAction) {
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`${client.emoji.tick} | Successfully muted ${member.user.username} for ${ms(duration, { long: true })}.`)
                        .addFields({
                            name: `Reason : `,
                            value: `${muteReason}`
                        })
                ]
            });
        }
    }
}