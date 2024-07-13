"use strict";

var express = require('express');

var http = require('http');

var bodyParser = require('body-parser');

var cors = require('cors');

var path = require('path');

var socketIO = require('socket.io');

var _require = require("./database"),
    users = _require.users;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var port = process.env.port || 3000;
app.use(bodyParser.json());
app.use(cors());
app.use(express["static"](path.join(__dirname, 'public'))); // Mock user database
// Track online users

var onlineUsers = [];
app.post('/login', function (req, res) {
  var _req$body = req.body,
      username = _req$body.username,
      password = _req$body.password;
  var user = users.find(function (u) {
    return u.username === username && u.password === password;
  });

  if (user) {
    if (onlineUsers.includes(username)) {
      res.status(403).json({
        success: false,
        message: 'User already logged in'
      });
    } else {
      onlineUsers.push(username);
      res.json({
        success: true,
        username: user.username
      });
    }
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});
app.post('/signup', function (req, res) {
  var _req$body2 = req.body,
      username = _req$body2.username,
      password = _req$body2.password;
  var userExists = users.some(function (u) {
    return u.username === username;
  });

  if (userExists) {
    res.status(409).json({
      success: false,
      message: 'Username already taken'
    });
  } else {
    users.push({
      username: username,
      password: password
    });
    res.json({
      success: true,
      username: username
    });
    console.log(users);
  }
}); // Serve the frontend

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
}); // Socket.io connection

io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('chat message', function (msg) {
    io.emit('chat message', msg);
  });
  socket.on('logout', function (username) {
    onlineUsers = onlineUsers.filter(function (user) {
      return user !== username;
    });
    console.log("".concat(username, " logged out"));
  });
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});
server.listen(port, function () {
  console.log("Server running on 192.168.100.162:".concat(port));
});