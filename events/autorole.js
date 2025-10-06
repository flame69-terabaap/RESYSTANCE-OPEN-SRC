module.exports = async (client) => {
    client.on('guildMemberAdd', async (member) => {

        if (member.user.bot === false) {

            let autoroleHumans = await client.db.get(`autoroleHumans_${member.guild.id}`);

            if (!autoroleHumans || autoroleHumans === null)
                return;

            if (autoroleHumans.length === 0)
                return;

            autoroleHumans.forEach((roleID) => {
                const role = member.guild.roles.cache.find((r) => r.id === roleID);

                if (role)
                    member.roles.add(role, reason=`${client.user.username} -> Human Autoroles`)
            });
        } else {

            if (member.user.bot === true) {

                let autoroleBots = await client.db.get(`autoroleBots_${member.guild.id}`);

                if (!autoroleBots || autoroleBots === null)
                    return;

                if (autoroleBots.length === 0)
                    return;

                autoroleBots.forEach((roleID) => {
                    const role = member.guild.roles.cache.find((r) => r.id === roleID);

                    if (role)
                        member.roles.add(role, reason=`${client.user.username} -> Bot Autoroles`)
                });
            }
        }
    })
};