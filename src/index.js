import './styles.css';

// ===== Constants and Global Variables =====
const PlayerGrid = document.querySelector(".PlayerGrid");
const ComputerGrid = document.querySelector(".ComputerGrid");
const compShipContainer = document.querySelector(".computerShipContainer");
const computerShips = document.querySelectorAll(".Computership");
const shipElements = document.querySelectorAll(".ship");
const startGameBtn = document.querySelector(".startGameBtn");

let gameStarted = false;
let shipCounter = 0;
let compShipCounter = 0;
let OccupiedCells = [];
let occupiedCompCells = [];
const PlayerShipMap={};
const ComputerShipMap={};
let PLayerScore=0;
let ComputerScore=0;


// ===== Ship Constructor =====
function Ship(length) {
  this.length = length;
  this.hitCount = 0;
    this.hit = function () {
    this.hitCount++;
    console.log(`${this.name} hitCount: ${this.hitCount}`);
  };

  this.isSunk = function () {
    return this.hitCount >= this.length;
  };
}

// ===== Utility =====
function createShip(length) {
  const ship = new Ship(length);
  console.log(`created a new ship of length : ${ship.length}`);
}

// ===== Generate Player & Computer Grids =====
for (let i = 0; i < 100; i++) {
  const Playercell = document.createElement("div");
  Playercell.classList.add("cell");
  PlayerGrid.appendChild(Playercell);

  const Compcell = document.createElement("div");
  Compcell.classList.add("cell");
  ComputerGrid.appendChild(Compcell);
}

// ===== Initialize Draggable Ships =====
shipElements.forEach((ship) => {
  const length = Number(ship.dataset.length);
  ship.style.display = "grid";
  ship.style.gridTemplateColumns = `repeat(${length}, 40px)`;
  ship.style.gridTemplateRows = '40px';
  ship.style.backgroundColor = 'transparent';
  ship.style.cursor = 'grab';
  ship.innerHTML = "";

  for (let i = 0; i < length; i++) {
    const part = document.createElement("div");
    part.style.width = '40px';
    part.style.height = '40px';
    part.style.border = '1px solid black';
    part.style.backgroundColor = 'lightblue';
    ship.appendChild(part);
  }

  ship.addEventListener("dragstart", (e) => {
    ship.id = `ship-${length}-${shipCounter}`;
    e.dataTransfer.setData("text/plain", length);
    e.dataTransfer.setData("text/id", ship.id);
    console.log("Dragging ship with ID:", ship.id);
    shipCounter++;
  });
});

// ===== Ship Drop Handling (Player Grid) =====
document.querySelectorAll(".cell").forEach((cell) => {
  cell.addEventListener("dragover", (e) => e.preventDefault());

  cell.addEventListener("drop", (e) => {
    e.preventDefault();
    const length = parseInt(e.dataTransfer.getData("text/plain"));
    const cellIndex = Array.from(PlayerGrid.children).indexOf(cell);
    const x = cellIndex % 10;
    const shipId = e.dataTransfer.getData("text/id");
    const draggedShip = document.getElementById(shipId);

    if (OccupiedCells.includes(cellIndex)) { 
      alert("DAMAGE! Ships overlapping");
    } 

    else {
      if (x + length <= 10) {
        const shipInstance = new Ship(length);
        for (let i = cellIndex; i < cellIndex + length; i++) {
          
          PlayerGrid.children[i].style.backgroundColor = 'lightblue';
          OccupiedCells.push(i);
          PlayerShipMap[cellIndex+i]=shipInstance;
        }
        draggedShip.style.display = 'none';
      } else {
        alert('Ship length exceeds');
      }
    }
  });
});

// ===== Computer Ships Setup (UI Only) =====
computerShips.forEach((compShip) => {
  const length = Number(compShip.dataset.length);
  compShip.style.display = "grid";
  compShip.style.gridTemplateColumns = `repeat(${length}, 40px)`;
  compShip.style.gridTemplateRows = '40px';
  compShip.style.backgroundColor = 'transparent';
  compShip.innerHTML = "";

  for (let i = 0; i < length; i++) {
    const part = document.createElement("div");
    part.style.width = '40px';
    part.style.height = '40px';
    part.style.border = '1px solid black';
    part.style.backgroundColor = 'lightblue';
    compShip.appendChild(part);
  }
});

// ===== Start Game Button =====
startGameBtn.addEventListener("click", () => {
  alert("Let the Battle begin");
  gameStarted = true;
  console.log("Start button clicked");
  placeComputerShips();
  PlayerTurn();
});

// ===== Place Computer Ships Randomly =====
function placeComputerShips() {
  console.log("Placing computer ships...");
  computerShips.forEach((compShip) => {
    const length = Number(compShip.dataset.length);
    let validPositionFound = false;
    let startIndex;

    while (!validPositionFound) {
      startIndex = Math.floor(Math.random() * 100);
      const x = startIndex % 10;

      if (x + length <= 10) {
         const shipInstance=new Ship(length);
        const proposedIndices = [];
        for (let i = 0; i < length; i++) {
          proposedIndices.push(startIndex + i);
        }

        const isOverlap = proposedIndices.some(index => occupiedCompCells.includes(index));
        if (!isOverlap) {
          proposedIndices.forEach(index => {
            const cell = ComputerGrid.children[index];
            cell.style.backgroundColor = "transparent";
            console.log("Placed part of ship at cell:", index);
            occupiedCompCells.push(index);
            ComputerShipMap[index]=shipInstance;
          });
          validPositionFound = true;
        }
      }
    }
  });
}

// ===== Player Turn =====
function PlayerTurn() {
  const allCompCells = [...ComputerGrid.children];
  allCompCells.forEach((Compcell) => {
    Compcell.addEventListener("click", (e) => {
      e.preventDefault();
      if (Compcell.innerHTML === '') {
        Compcell.style.cursor = 'crosshair';
        const index = Array.from(ComputerGrid.children).indexOf(Compcell);

        if (occupiedCompCells.includes(index)) {
          console.log('HIT!');
          Compcell.style.backgroundColor = 'red';
          Compcell.innerHTML = '💥';

          const shipHit = ComputerShipMap[index];
          if(shipHit){
            shipHit.hit();
            if(shipHit.isSunk()){
                const shipHitlength=shipHit.length;
                PLayerScore++;
                console.log('Computer Ship sunk of length :',shipHit,shipHitlength);
                Winner();
            }
          }
          
        } else {
          console.log('Miss!');
          Compcell.style.backgroundColor = 'lightgray';
          Compcell.innerHTML = `<p>X</p>`;

        }

        Compcell.style.textAlign = 'center';
        setTimeout(() => ComputerTurn(), 1000);
      } else {
        alert('Already Attacked');
      }
    });
  });
}

// ===== Computer Turn =====
function ComputerTurn() {
  const allCells = [...PlayerGrid.children];
  let randomCell;

  do {
    const randomIndex = Math.floor(Math.random() * allCells.length);
    randomCell = allCells[randomIndex];
  } while (randomCell.innerHTML !== '');

  const index = allCells.indexOf(randomCell);
  randomCell.style.cursor = 'crosshair';
  randomCell.style.textAlign = 'center';
  randomCell.innerHTML = `<p>X</p>`;
  randomCell.style.backgroundColor = 'lightgray';

  if (OccupiedCells.includes(index)) {
    randomCell.style.backgroundColor = 'red';
    randomCell.innerHTML = '💥';
    console.log('HIT!');
    const shipHit = PlayerShipMap[index];
          if(shipHit){
            shipHit.hit();
            if(shipHit.isSunk()){
                const CompShipHitlength=shipHit.length;
                ComputerScore++;
                console.log('Player Ship sunk : ',shipHit,CompShipHitlength);
                Winner();
            }
          }
    

  } else {
    console.log('Miss!');
  }
}

function Winner(){
    if(PLayerScore>=5){
        alert('Player has claimed victory!');
        return;
    }
    else if(ComputerScore>=5){
        alert('Player has fallen...');
        return;
    }
    else return;
}