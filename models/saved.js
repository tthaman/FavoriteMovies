const mongoose = require('mongoose');

const savedSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true},
    watchList: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'movies' }], required: true },
    favoriteMovies: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'movies' }], required: true }
});

module.exports = mongoose.model("saved", savedSchema);
