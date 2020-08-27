const express = require("express");
const routes = require("./routes");
const server = express();

server.use(express.json());
server.use(express.static(__dirname + '/public'));

const mustacheExpress = require('mustache-express');
server.engine('mustache', mustacheExpress());
server.set('view engine', 'mustache');

server.use(routes);

module.exports = server;
