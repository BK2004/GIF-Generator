require('dotenv').config({path:__dirname+'/./.env'})
const https = require("https");
const Discord = require("discord.js");
const client = new Discord.Client({ intents: [
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.MessageContent
]});
const rest = new Discord.REST({ version: '10' }).setToken(process.env.TOKEN);

const QUERY_LIMIT = 25;

const register_cmds = async () => {
    try {
        console.log("Registering commands...");

        await rest.put(Discord.Routes.applicationCommands(process.env.APPLICATION_ID), {
            body: [
                {
                    name: "zgif",
                    type: 1,
                    description: "Generate a random GIF.",
                    options: [
                        {
                            name: "msg",
                            description: "Message to use to generate GIF",
                            required: true,
                            type: 3
                        }
                    ]
                }
            ],
        });

        console.log("Finished registering commands.");
    } catch(e){ console.log(e); }
};

register_cmds().then(() => console.log("done"));

client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        if (interaction.commandName == "zgif") {
            const msg = interaction.options.getString("msg");
            const url = `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&q=${msg}&limit=${QUERY_LIMIT}`;

            https.get(url, (response) => {
                data = '';
                response.on('data', (d) => {
                    data += d;
                })
        
                response.on('end', () => {
                    let parsed = JSON.parse(data);
                    if (parsed.data && parsed.data.length > 0) {
                        interaction.reply(parsed.data[Math.floor(Math.random() * parsed.data.length)].embed_url);
                    } else {
                        interaction.reply("no GIF found :(");
                    }
                })
            })
        }
    }
})

client.login(process.env.TOKEN);
