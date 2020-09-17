const socket = io();

let track, last = null, players = [], moves = 0;

function generateBoard(dim) {
  // Create a specific track history.
  const dimSq = dim * dim;
  track = new Array(dimSq).fill(null);
  // Create the DOM Play Grid
  const grid = document.getElementById("grid");

  let playCounter = 0;
  for (let i = 0; i < dim; i++) {
    // Create Grid Elements
    const subGrid = document.createElement("div");
    subGrid.id = "sub-grid";

    for (let j = 0; j < dim; j++) {
      let areaButton = document.createElement("button");
      areaButton.id = "area";
      areaButton.className = `area_${playCounter}`;
      areaButton.onclick = playMove;
      subGrid.appendChild(areaButton);
      playCounter++;
    }

    grid.appendChild(subGrid);
  }
}

function playMove(e) {
  if (players.length < 2) return; // If only one player is online, dont play.
  let player = players.indexOf(socket.id);
  if (player === -1 || player > 1) return; // Non participants cannot play.
  if (last === socket.id) return; // Previously Played
  if (player !== 0 && moves === 0) return; // Only the first player can play first move.
  const play = parseInt(e.target.className.split('_')[1]);
  track[play] = socket.id;
  socket.emit('move', track);
  socket.emit('last', socket.id);
}

function renderBoard() {
  track.forEach((node, index) => {
    let moveNode = document.querySelector(`.area_${index}`);
    if (node !== null) {
      // Graphic Response to click.
      let playerIndex = players.indexOf(node);
      if (playerIndex === 0) moveNode.innerHTML = "O";
      else if (playerIndex === 1) moveNode.innerHTML = "X";
    } else moveNode.innerHTML = "";
    // If some move played, disable the button.
    moveNode.disabled = node !== null;
  });
}

function checkWinner() {
  let victor = null;
  let victory = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  
  if (moves >= 3) {
    // For each pattern in victory, check if values at those indexes in track are the same.
    victory.forEach(pattern => {
      let res = pattern.map(i => track[i]).reduce((a, c) => a === c ? c : null);
      if (res !== null) victor = res;
    });
  }

  if (victor !== null) {
    let playerIndex = players.indexOf(victor) + 1;
    alert(`Player ${playerIndex} wins !`);
    socket.emit('reset');
  }

  if (moves === 9 && victor === null) {
    alert("Match is a draw !");
    socket.emit('reset');
  }
}

// Socket Functions
socket.on('players', (playerList) => {
  players = playerList;
  // Reset board if player count is 2. New Game.
  if (playerList.length <= 2) socket.emit('reset');
});

socket.on('last', (lp) => last = lp);

socket.on('reset', () => {
  track.fill(null);
  last = null;
  moves = 0;
  renderBoard();
})

socket.on('move', data => {
  track = data;
  moves = data.filter(m => m !== null).length;
  renderBoard();
  checkWinner();
})