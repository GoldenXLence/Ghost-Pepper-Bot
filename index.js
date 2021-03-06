// All the requires
const Discord = require('discord.js');
const client = new Discord.Client();
const token = require('./token.json');
const ms = require('ms');
var GuildModel = require('./models/Guild');
var mongoose = require('mongoose');
var database = require('./database.json');
const error = require('./errors');

// bad-words
const Filter = require('bad-words');
var filter = new Filter();

// JSON Files
const config = require('./config.json');

const fs = require('fs');
client.commands = new Discord.Collection();

// Tells bot where to find the commands files
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

// Tells the console when the bot has logged on
client.on('ready', () => {
    console.log("The bot is ONLINE");

    // Set activity
    try {
        client.user.setActivity(`${config.activity}`, { type: 'LISTENING' }); // LISTENING PLAYING STREAMING
        console.log(`Set activity to ${config.activity}`);
    } catch (err) {
        console.error(err);
    }
});

// Listens for a message and checks if its a command
client.on('message', message => {

    var GuildModel = require('./models/Guild');
    var mongoose = require('mongoose');
    var database = require('./database.json');

    var req = GuildModel.findOne({ "_id": message.guild.id }, function (err, req) {
        if (req.autoMod === true) {

            // Banned Words
            if (req.bannedWords = true) {
                if (filter.isProfane(message)) {
                    try {
                        message.delete();
                        message.reply(error.wordFilter());
                    } catch (err) {
                        console.error(`Error trying to delete a message in ${message.guild.name}`);
                    }
                    break;
                }
            };
        };

        if (!message.content.startsWith(`${config.prefix}`)) {
            return;
        } else {

            // Anything beyond this point will only run if the message starts with the bot prefix

            let args = message.content.toLowerCase().substring(config.prefix.length).split(" ");

            var GuildModel = require('./models/Guild');
            var mongoose, error = require('mongoose');
            var database = require('./database.json');
        }

        let args = message.content.toLowerCase().substring(config.prefix.length).split(" ");

        if (!req) {
            if (args[0] === "setup") {
                client.commands.get('setup').execute(message, args, config, Discord, mongoose, error, GuildModel);
            };
        } else {

            // Launches the appropriate command file

            switch (args[0]) {

                case "ping":
                    client.commands.get('ping').execute(message, args, config);
                    break;

                case "kick":
                case "k":
                    client.commands.get('kick').execute(message, args, config, Discord, GuildModel, mongoose, error);
                    break;

                case "ban":
                case "b":
                    client.commands.get('ban').execute(message, args, config, Discord, GuildModel, mongoose, error);
                    break;

                case "mute":
                case "m":
                    client.commands.get('mute').execute(message, args, config, Discord, GuildModel, mongoose, error);
                    break;

                case "prefix":
                    client.commands.get('prefix').execute(message, args, config, Discord, error);
                    break;

                case "settings":
                    client.commands.get('settings').execute(message, args, config, Discord, GuildModel, mongoose, error);
                    break;
                case "warn":
                case "w":
                    client.commands.get('warn').execute(message, args, config, Discord, GuildModel, mongoose, error);
                    break;
            };
        }
    });
});

// Logs the bot in to both database and to Discord
mongoose.connect(database.url, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});
client.login(token.token);