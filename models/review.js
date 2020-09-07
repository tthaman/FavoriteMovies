const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    email: { type: String, required: true},
    review: { type: String, required: true },
    rating: { type: Number, required: true },
    createdAt: {type: Date, default: Date.now},
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'movies', required: true }
});

module.exports = mongoose.model("reviews", reviewSchema);
