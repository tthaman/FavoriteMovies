module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
    await db.collection('movies').updateMany({},
      { $match: { Runtime: { $ne: "" } } },
      { $set: { Runtime: { $concat: [{ $toString: { $floor: { $divide: ["$Runtime", 60] } } }, "h ", { $toString: { $mod: ["$Runtime", 60] } }, "m"] } } },
      { multi: true }
    )
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
