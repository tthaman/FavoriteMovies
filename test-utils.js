const mongoose = require('mongoose');
const models = [require('./models/saved'),
                require('./models/review'),
                require('./models/movie'),
                require('./models/token'),
                require('./models/user')];

module.exports = {};

module.exports.connectDB = async () => {
  await mongoose.connect(global.__MONGO_URI__, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  });
  await Promise.all(models.map(m => m.syncIndexes()));
}

module.exports.stopDB = async () => {
  await mongoose.disconnect();
}

module.exports.clearDB = async () => {
  await Promise.all(models.map(model => model.deleteMany()))
}
