const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    guildName: String,
});

module.ecports = mongoose.model('Guild', guildSchema, 'guilds');