var http = require('http');
var express = require('express');
var ShareDB = require('sharedb');
var WebSocket = require('ws');
var WebSocketJSONStream = require('websocket-json-stream');

var db = require('sharedb-mongo')(process.env.DB || "mongodb://localhost:27017/liveshow");
var backend = new ShareDB({db: db});

var connection = backend.connect();
var doc = connection.get('liveshow', 'home');
doc.fetch(function(err) {
  if (err) throw err;
  if (doc.type === null) {
    doc.create({
      "title": "",
      "id": "0",
      "presentations": {},
      "background": "#00bcd4",
      "foreground": "#000000",
      "accent": "#ff4081",
      "accent-foreground": "#ffffff",
      "content":
      {
        "slides":
        [
          [
            {
              "style": "presentation-title",
              "content":
              [
                {
                  "style": "title",
                  "content": "Add a title"
                }
              ]
            },
            {
              "style": "speaker",
              "content":
              [
                {
                  "style": "title",
                  "content": "John Doe"
                },
                {
                  "style": "subheading",
                  "content": "@example"
                },
                {
                  "style": "subheading",
                  "content": "Job Title"
                },
                {
                  "style": "supporting-text",
                  "content": "Add a short bio"
                }
              ]
            },
            {
              "style": "content",
              "content":
              [
                {
                  "style": "title",
                  "content": "Add a title"
                },
                {
                  "style": "supporting-text",
                  "content": "Add some content"
                }
              ]
            }
          ]
        ]
      }
    }, startServer);
    return;
  }
  startServer();
});

function startServer() {
  // Create a web server to serve files and listen to WebSocket connections
  var app = express();
  app.set('view engine', 'ejs');
  app.use(express.static('public'));
  app.get('/', function(req, res) {
    doc.fetch(function (err) {
      if (err) throw err;
      res.render('edit', {
        data: doc.data
      });
    });
  });
  var server = http.createServer(app);

  // Connect any incoming WebSocket connection to ShareDB
  var wss = new WebSocket.Server({server: server});
  wss.on('connection', function(ws, req) {
    var stream = new WebSocketJSONStream(ws);
    backend.listen(stream);
  });

  var port = process.env.PORT || 8000;
  server.listen(port);
}
