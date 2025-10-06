const {
    EmbedBuilder,
    PermissionsBitField
} = require("discord.js");

module.exports = {
    name: "purge",
    aliases: ["clear"],
    category: "moderation",
    usage: "?purge <amount>",
    description: "Deletes a certain amount of messages in a channel.",
    cooldown: 5,

    run: async (client, message, args, prefix) => {

        if (!message.member.permissions.has(PermissionsBitField.resolve("ManageMessages")))
            return message.channel.send(`${client.emoji.cross} | You need to have \`Manage Messages\` permission in order to use this command.`);

        if (!message.guild.members.me.permissions.has(PermissionsBitField.resolve("ManageMessages")))
            return message.channel.send(`${client.emoji.cross} | I need to have \`Manage Messages\` permission in order to use this command.`);

        const amt = args[0];
        if (!amt)
            return message.channel.send(`${client.emoji.cross} | Please provide the number of messages to deleted.`);

        if (!parseInt(amt))
            return message.channel.send(`${client.emoji.cross} | Please provide a valid number of messages to be deleted.`);

        if (amt > 200)
            return message.channel.send(`${client.emoji.cross} | You can only delete up to 199 messages at once.`);

        await message.delete().catch((err) => {
            client.logger.log(err);
        });
        Delete(message.channel, amt)
        message.channel.send(`${client.emoji.tick} | Successfully deleted ${amt} messages.`).then((msg) => {
            setTimeout(() => {
                msg.delete().catch((err) => {
                    client.logger.log(err);
                });
            }, 5000);
        });
    }
};

function Delete(channel, amt) {
    for (let i = amt; i > 0; i -=100) {
        if (i > 100) {
            channel.bulkDelete(100).catch((_) => {})
        } else {
            channel.bulkDelete(i).catch((_) => {})
        }
    }
}