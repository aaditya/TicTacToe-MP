let dimensions;

let current_player = 1;

let track = [];

const map = (x, y) => {
  let move = document.querySelector(`.area_${x}_${y}`);

  let obj = {};
  obj.player = current_player;

  if (current_player === 1) {
    move.innerHTML = "O";
    move.disabled = true;
    current_player = 2;
  } else if (current_player === 2) {
    move.innerHTML = "X";
    move.disabled = true;
    current_player = 1;
  }

  obj.position  = { x, y };

  track.push(obj);
  mapTrack(x, y);
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
    let p1xm = track.filter(t => t.player == 1 && t.position.x == i + 1).length;
    let p2xm = track.filter(t => t.player == 2 && t.position.x == i + 1).length;

    // For Y-axis
    let p1ym = track.filter(t => t.player == 1 && t.position.y == i + 1).length;
    let p2ym = track.filter(t => t.player == 2 && t.position.y == i + 1).length;

    // Diagonal 1 Cases
    let p1d1m = track.filter(t => t.player == 1 && t.position.x == t.position.y).length;
    let p1d2m = track.filter(t => t.player == 1 && (t.position.x + t.position.y == dimensions + 1)).length;

    // Diagonal 2 Case
    let p2d1m = track.filter(t => t.player == 2 && t.position.x == t.position.y).length;
    let p2d2m = track.filter(t => t.player == 2 && (t.position.x + t.position.y == dimensions + 1)).length;

    if (p1xm == dimensions || p1ym == dimensions || p1d1m == dimensions || p1d2m == dimensions) {
      victory(1);
    }
    if (p2xm == dimensions || p2ym == dimensions || p2d1m == dimensions || p2d2m == dimensions) {
      victory(2);
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