let socket = io();

let dimensions;

let track = [];
let players = [];

let lastMove;

const map = (x, y, player) => {
  if (players.length < 2 || (lastMove && lastMove == socket.id)) {
    return;
  }

  let current = player || socket.id

  let move = {
    player: current,
    position: {
      x: x,
      y: y
    }
  }

  let mvDOM = document.querySelector(`.area_${x}_${y}`);

  if (current === players[0]) {
    mvDOM.innerHTML = "O";
  } else if (current === players[1]) {
    mvDOM.innerHTML = "X";
  }

  if (players.includes(socket.id) && (current === socket.id)) {
    socket.emit('move', move)
  }

  mvDOM.disabled = true;

  track.push(move);

  mapTrack();

  lastMove = current;
}

const victory = (player) => {
  reset();
  if (player == 0) {
    alert("Match is a draw.");
  } else {
    alert("Player " + player + " wins !");
  }
}

const reset = () => {
  track = [];
  current_player = 1;

  for (let i = 0; i < dimensions; i++) {
    for (let j = 0; j < dimensions; j++) {
      let move = document.querySelector(`.area_${i + 1}_${j + 1}`);
      move.innerHTML = "";
      move.disabled = false;
    }
  }
}

const mapTrack = () => {
  for (let i = 0; i < dimensions; i++) {
    // For X-axis
    let p1xm = track.filter(t => t.player == players[0] && t.position.x == i + 1).length;
    let p2xm = track.filter(t => t.player == players[1] && t.position.x == i + 1).length;

    // For Y-axis
    let p1ym = track.filter(t => t.player == players[0] && t.position.y == i + 1).length;
    let p2ym = track.filter(t => t.player == players[1] && t.position.y == i + 1).length;

    // Diagonal 1 Cases
    let p1d1m = track.filter(t => t.player == players[0] && t.position.x == t.position.y).length;
    let p1d2m = track.filter(t => t.player == players[1] && (t.position.x + t.position.y == dimensions + 1)).length;

    // Diagonal 2 Case
    let p2d1m = track.filter(t => t.player == players[0] && t.position.x == t.position.y).length;
    let p2d2m = track.filter(t => t.player == players[1] && (t.position.x + t.position.y == dimensions + 1)).length;

    if (p1xm == dimensions || p1ym == dimensions || p1d1m == dimensions || p1d2m == dimensions) {
      victory(players[0]);
    }
    if (p2xm == dimensions || p2ym == dimensions || p2d1m == dimensions || p2d2m == dimensions) {
      victory(players[1]);
    }
    if (track.length == dimensions * dimensions) {
      victory(0);
    }
  }
}

const generateBoard = (dim) => {
  dimensions = dim;
  let grid = document.getElementById("grid");
  grid.innerHTML = "";
  for (let i = 0; i < dim; i++) {
    let subGrid = document.createElement("div");
    subGrid.id = "sub-grid";
    for (let j = 0; j < dim; j++) {
      let areaButton = document.createElement("button");
      areaButton.id = "area";
      areaButton.className = `area_${i + 1}_${j + 1}`;
      areaButton.onclick = function () { map(i + 1, j + 1) };
      subGrid.appendChild(areaButton);
    }
    grid.appendChild(subGrid);
  }
}

socket.on('players', (p) => {
  if (p.length !== 2) {
    reset();
  }
  players = p;
})

socket.on('move', move => {
  if (move.player !== socket.id) {
    lastMove = move.player;
    map(move.position.x, move.position.y, move.player)
  }
})