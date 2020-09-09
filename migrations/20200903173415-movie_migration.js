module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
    await db.movies.find().forEach((movie) => {
      db.movies.update( { $set: { averageRating: (parsefloat(movie.RottenTomatoes) + movie.IMDb*100)/2 } });
      });
    },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    await db.movies.updateMany(
       { $unset: { averageRating: "" } });
  },
};
