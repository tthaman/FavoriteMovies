const server = require("./server");
const mongoose = require('mongoose');
require('dotenv').config()

const port = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost/movies', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}).then(() => {
  server.listen(port, () => {
   console.log(`Server is listening on http://localhost:${port}`);
  });
});
