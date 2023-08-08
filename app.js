const https = require("https");
const Discord = require("discord.js");
const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.MessageContent]});

const QUERY_LIMIT = 25;

require('dotenv').config({path:__dirname+'/./.env'})

client.on("messageCreate", (message) => {
    if (message.author.bot) {
        return;
    }

    const msg = message.content;
    let url = `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&q=${msg}&limit=${QUERY_LIMIT}`;

    https.get(url, (response) => {
        data = '';
        response.on('data', (d) => {
            data += d;
        })

        response.on('end', () => {
            let parsed = JSON.parse(data);
            if (parsed.data && parsed.data.length > 0) {
                message.reply(parsed.data[Math.floor(Math.random() * parsed.data.length)].embed_url);
            } else {
                message.reply("no GIF found :(");
            }
        })
    })
})

client.login(process.env.TOKEN);