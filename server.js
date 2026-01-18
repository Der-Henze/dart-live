const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname));

let players = [];

io.on('connection', (socket) => {
    // Weise dem Spieler eine Nummer zu (1 oder 2)
    let playerNumber = players.length + 1;
    if (playerNumber <= 2) {
        players.push(socket.id);
        socket.emit('assign-player', playerNumber);
        console.log(`Spieler ${playerNumber} ist beigetreten.`);
    } else {
        socket.emit('assign-player', 0); // Zuschauer-Modus
    }

    socket.on('dart-thrown', (data) => {
        socket.broadcast.emit('update-game', data);
    });

    socket.on('disconnect', () => {
        players = players.filter(id => id !== socket.id);
        console.log('Ein Spieler hat die Verbindung getrennt.');
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log('Darts-Server läuft auf Port ' + PORT);
});
const PORT = process.env.PORT || 3000;

// Diese Prüfung verhindert den "ERR_SERVER_ALREADY_LISTEN" Fehler
if (!module.parent) {
    http.listen(PORT, () => {
        console.log('Darts-Server läuft auf Port ' + PORT);
    });
}
