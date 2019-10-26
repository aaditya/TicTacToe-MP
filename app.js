const express = require("express");
const http = require('http');

const app = express();

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile("public/index.html");
})

const server = http.createServer(app);

// Initialize Server
const io = require("socket.io")(server);

let players = [];
let pool = [];

io.on('connection', function (socket) {
    if (players.length < 2) {
        players.push(socket.id);
    } else if (players.length >= 2) {
        pool.push(socket.id);
    }

    io.emit('players', players);

    socket.on('disconnect', (reason) => {
        if (players.includes(socket.id)) {
            let playerIndex = players.indexOf(socket.id);
            players.splice(playerIndex, 1);
            if (pool.length > 0) {
                players.push(pool.shift());
            }
            io.emit('players', players);
        } else if (pool.includes(socket.id)) {
            let playerIndex = pool.indexOf(socket.id);
            pool.splice(playerIndex, 1);
        }
    });

    socket.on('move', function (move) {
        io.emit('move', move);
    });
});

let port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log("Server listening.")
})

module.exports = server;
