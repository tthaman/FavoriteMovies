const mongoose = require('mongoose');
const moment = require('moment');

const reviewSchema = new mongoose.Schema({
    email: { type: String, required: true},
    review: { type: String, required: true },
    rating: { type: Number, required: true },
    createdAt: {type: String, default: moment(Date().now).format('MMMM Do YYYY')},
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'movies', required: true }
});

module.exports = mongoose.model("reviews", reviewSchema);
