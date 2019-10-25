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

// const mapTrack = (x, y) => {
//   for (let i = 0; i < dimensions; i++) {
//     // For X-axis
//     let p1xm = track.filter(t => t.player == 1 && t.position.x == i + 1).length;
//     let p2xm = track.filter(t => t.player == 2 && t.position.x == i + 1).length;

//     // For Y-axis
//     let p1ym = track.filter(t => t.player == 1 && t.position.y == i + 1).length;
//     let p2ym = track.filter(t => t.player == 2 && t.position.y == i + 1).length;

//     // Diagonal Cases
//     let p1dm = track.filter(t => t.player == 1 && t.position.x == t.position.y).length;
//     let p2dm = track.filter(t => t.player == 2 && t.position.x == t.position.y).length;

//     if (p1xm == 3 || p1ym == 3 || p1dm == 3) {
//       victory(1);
//     }
//     if (p2xm == 3 || p2ym == 3 || p2dm == 3) {
//       victory(2);
//     }
//   }

// }

const mapTrack = () => {

  const p1m = track.filter(move => move.player == 1);
  const p2m = track.filter(move => move.player == 2);

  // horizontal and diagonal check;
  const p1ym = p1m.map(move => move.position.y).sort();
  const p2ym = p2m.map(move => move.position.y).sort();
  if (p1ym.length == 3 && checkHorDiaCondition(p1ym)) {
    victory(1);
  }
  if (p2ym.length == 3 && checkHorDiaCondition(p2ym)) {
    victory(2);
  }

  // vertical condition
  const p1xm = p1m.map(move => move.position.x).sort();
  const p2xm = p2m.map(move => move.position.x).sort();

  if (p1xm.length == 3 && checkHorDiaCondition(p1xm)) {
    victory(1);
  }
  if (p2ym.length == 3 && checkHorDiaCondition(p2ym)) {
    victory(2);
  }

}


const checkHorDiaCondition = (arr) => {
  const [first, second, third] = arr;
  return first == 1 && second == 2 && third == 3
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