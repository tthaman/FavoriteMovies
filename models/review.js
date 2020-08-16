const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    review: { type: String },
    rating: { type: Number },
    createdAt: {type: Date, default: Date.now},
    movieInfo: { type: Schema.Types.ObjectId, ref: 'movies', required: true }
});

module.exports = mongoose.model("reviews", reviewSchema);