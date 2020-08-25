const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  ID: { type: Number },
  Title: { type: String, required: true },
  Year: { type: Number, required: true },
  Age: { type: String, required: true },
  IMDB: { type: Number },
  Rotten_Tomatoes: { type: String },
  Netflix: { type: Number, default: 0 },
  Hulu: { type: Number, default: 0 },
  Prime_Video: { type: Number, default: 0 },
  DisneyPlus: { type: Number, default: 0 },
  Type: { type: Number, default: 0 },
  Directors: { type: String, required: true },
  Genres: { type: String, required: true },
  Country: { type: String, required: true },
  Language: { type: String, required: true },
  Runtime: { type: Number, required: true }
});

movieSchema.index({ Title: "text" });
module.exports = mongoose.model("movies", movieSchema);
