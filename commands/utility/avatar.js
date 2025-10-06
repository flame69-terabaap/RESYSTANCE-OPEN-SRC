const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = {
    name: "avatar",
    aliases: ["av", "ava", "pfp"],
    category: "utility",
    description: "Get the avatar of a user.",
    usage: "?avatar [user]",
    cooldown: 5,

    run: async (client, message, args, prefix) => {

        let id = await getUserFromMention(message, args[0]);

        if (!id) {
            try {
                id = await client.users.fetch(args[0]);
            } catch (error) {

                const emb = new EmbedBuilder()
                    .setAuthor({
                        name: message.author.tag,
                        iconURL: message.author.displayAvatarURL({ dynamic: true })
                    })
                    .setFooter({
                        text: `Requested By ${message.author.tag}`,
                        iconURL: message.author.displayAvatarURL({ dynamic: true })
                    })
                    .setImage(message.member.displayAvatarURL({ dynamic: true, size: 4096 }))
                    .setDescription(
                        `[\`GIF\`](${message.member.displayAvatarURL({
                            dynamic: true,
                            size: 2048,
                            format: 'gif'
                        })}) | [\`PNG\`](${message.member.displayAvatarURL({
                            dynamic: true,
                            size: 2048,
                            format: 'png'
                        })}) | [\`JPG\`](${message.member.displayAvatarURL({
                            dynamic: true,
                            size: 2048,
                            format: 'jpg'
                        })}) | [\`WEBP\`](${message.member.displayAvatarURL({
                            dynamic: true,
                            size: 2048,
                            format: 'webp'
                        })})`
                    )
                    .setColor(client.color)

                return message.channel.send({
                    embeds: [emb]
                })
            }
        }

        const embed = new EmbedBuilder()
            .setAuthor({
                name: id.tag,
                iconURL: id.displayAvatarURL({ dynamic: true })
            })
            .setFooter({
                text: `Requested By ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
            .setImage(`${id.displayAvatarURL({ dynamic: true, size: 4096 })}`)
            .setDescription(
                `[\`GIF\`](${id.displayAvatarURL({
                    dynamic: true,
                    size: 2048,
                    format: 'gif'
                })}) | [\`PNG\`](${id.displayAvatarURL({
                    dynamic: true,
                    size: 2048,
                    format: 'png'
                })}) | [\`JPG\`](${id.displayAvatarURL({
                    dynamic: true,
                    size: 2048,
                    format: 'jpg'
                })}) | [\`WEBP\`](${id.displayAvatarURL({
                    dynamic: true,
                    size: 2048,
                    format: 'webp'
                })})`
            )
            .setColor(client.color)

        message.channel.send({
            embeds: [embed]
        });
        }
    };

    function getUserFromMention(message, mention) {
        if (!mention) return null
    
        const matches = mention.match(/^<@!?(\d+)>$/)
        if (!matches) return null
    
        const id = matches[1]
        return message.client.users.fetch(id)  ||  message.member
    }