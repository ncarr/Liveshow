var express = require('express');
var sharejs = require('share');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// public folder to store assets
app.use(express.static(__dirname + '/public'));

// routes for app
app.get('/', function(req, res) {
  res.render('edit', {
    name: "Untitled document"
  });
});

require('redis');

// options for sharejs
var options = {
  db: {type: 'redis'},
  browserChannel: null,
  websocket: {}
};

// attach the express server to sharejs
server = sharejs.server.attach(app, options);

// listen on port 8000 (for localhost) or the port defined for heroku
var port = process.env.PORT || 8000;
server.listen(port);
