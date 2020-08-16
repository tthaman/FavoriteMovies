const mongoose = require('mongoose');

const savedSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    watchList: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'movies' }], required: true },
    favoriteMovies: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'movies' }], required: true }
});


module.exports = mongoose.model("saved", savedSchema);