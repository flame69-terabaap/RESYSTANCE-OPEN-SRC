const { Vile } = require('./structures/Vile');
const client = new Vile();
client.connect();
(async () => {
    await client.loadEvents();
    await client.loadMain();
})()
module.exports = client;