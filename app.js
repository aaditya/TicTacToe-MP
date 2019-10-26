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

let players = []

io.on('connection', function (socket) {
    players.push(socket.id);

    if (players.length == 2) {
        io.emit('players', players);
    }

    socket.on('disconnect', (reason) => {
        let playerIndex = players.indexOf(socket.id);
        players.splice(playerIndex, 1);
    });

    socket.on('move', function (move) {
        io.emit('move', move);
    });
});

server.listen(3000, () => {
    console.log("Server listening.")
})

module.exports = server;
