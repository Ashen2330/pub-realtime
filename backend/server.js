const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const socketIO = require('socket.io');
const { users } = require("./database")


const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = process.env.port || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Mock user database


// Track online users
let onlineUsers = [];

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        if (onlineUsers.includes(username)) {
            res.status(403).json({ success: false, message: 'User already logged in' });
        } else {
            onlineUsers.push(username);
            res.json({ success: true, username: user.username });
        }
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    const userExists = users.some(u => u.username === username);

    if (userExists) {
        res.status(409).json({ success: false, message: 'Username already taken' });
    } else {
        users.push({ username, password });
        res.json({ success: true, username });
        console.log(users);
    }
});

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Socket.io connection
io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('logout', (username) => {
        onlineUsers = onlineUsers.filter(user => user !== username);
        console.log(`${username} logged out`);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server running on 192.168.100.162:${port}`);
});
