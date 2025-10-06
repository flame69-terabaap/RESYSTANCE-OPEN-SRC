const {
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "help",
    aliases: ["commands"],
    description: "Shows all the commands of the bot",
    category: "information",
    cooldown: 10,

    run: async (client, message, args, prefix) => {
        
        if (!args[0]) {
            let embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({
                    name: `${client.user.username}'s Help Menu`,
                    iconURL: client.user.displayAvatarURL({ dynamic: true })
                })
                .setFooter({
                    text: `Made With ❤️ By ${client.user.username} Developers.`,
                    iconURL: client.user.displayAvatarURL({ dynamic: true })
                })
                .setThumbnail(`${message.author.displayAvatarURL({ dynamic: true })}`)
                .setDescription(`Hey ${message.author}, I am ${client.user.username}, a multipurpose discord bot with exciting and a lot of interesting features in order to enhance your experience while on discord.\n\nBelow are all of my commands : `)
                .addFields(
                    {
                        name: `${client.emoji.antinuke} Antinuke Commands \`(3)\``,
                        value: `\`\`\`yaml\nantinuke, extraowner, whitelist\`\`\``,
                        inline: false
                    },
                    {
                        name: `${client.emoji.mod} Moderation Commands \`(16)\``,
                        value: `\`\`\`yaml\naddemoji, ban, hide, ignore, kick, lock, mute, nickname, prefix, purge, role, roleicon, unban, unhide, unlock, unmute\`\`\``,
                        inline: false
                    },
                    {
                        name: `${client.emoji.info} Information Commands \`(8)\``,
                        value: `\`\`\`yaml\nhelp, invite, ping, profile, stats, support, uptime, vote\`\`\``,
                        inline: false
                    },
                    {
                        name: `${client.emoji.utility} Utility Commands \`(5)\``,
                        value: `\`\`\`yaml\nafk, avatar, gay, lesbo, membercount\`\`\``,
                        inline: false
                    },
                    {
                        name: `${client.emoji.vc} Voice Commands \`(12)\``,
                        value: `\`\`\`yaml\nvcdeafen, vcdeafenall, vckick, vckickall, vcmove, vcmute, vcmuteall, vcpull, vcundeafen, vcundeafenall, vcunmute, vcunmuteall\`\`\``,
                        inline: false
                    },
                    {
                        name: `${client.emoji.channel} Welcome Commands \`(1)\``,
                        value: `\`\`\`yaml\nautorole\`\`\``,
                        inline:false
                    }
                )

            return message.channel.send({
                embeds: [embed]
            });
        }
    }
};