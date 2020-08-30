const mongoose = require('mongoose');

const savedSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true},
    watchList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'movie', required: true }],
    favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'movie', required: true }],
});

module.exports = mongoose.model("saved", savedSchema);
