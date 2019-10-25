let dimensions;

let current_player = 1;

let track = [];

const map = (x, y) => {
  let move = document.querySelector(`.area_${x}_${y}`);

  track.push({
    "player": current_player,
    "position": { x, y }
  })

  if (current_player === 1) {
    move.innerHTML = "O";
    move.disabled = true;
    current_player = 2;
  } else if (current_player === 2) {
    move.innerHTML = "X";
    move.disabled = true;
    current_player = 1;
  }

  mapTrack(x, y);
}

const victory = () => {
  reset();
  alert("Player " + current_player + " wins !");
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
  const p1m = track.filter(move => move.player == 1);
  const p2m = track.filter(move => move.player == 2);

  // horizontal and diagonal check;
  const p1ym = p1m.map(move => move.position.y).sort();
  const p2ym = p2m.map(move => move.position.y).sort();

  // vertical condition
  const p1xm = p1m.map(move => move.position.x).sort();
  const p2xm = p2m.map(move => move.position.x).sort();

  if ((p1ym.length == 3 && checkSuccesstion(p1ym) || (p1xm.length == 3 && checkSuccesstion(p1xm)))) {
    victory(1);
  }
  if ((p2ym.length == 3 && checkSuccesstion(p2ym)) || (p2xm.length == 3 && checkSuccesstion(p2xm))) {
    victory(2);
  }
}


const checkSuccesstion = ([first, second, third]) => first == 1 && second == 2 && third == 3


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