"use strict";

window.onload = () => {
  setup(55);

  generateSquares(10);
  paint();

  moveEachSquare();
};

function setup(n) {
  window.grid = buildGridTable(n);
}

function buildGridTable(n) {
  let grid = [];
  let domGrid = document.getElementById("dungeon-grid");

  for (let _row = 0; _row < n; _row++) {
    let dataRow = [];
    let row = document.createElement("tr");

    for (let _col = 0; _col < n; _col++) {
      let cell = buildDomCell({ row: _row, col: _col });
      let dataCell = new Cell({
        row: _row,
        col: _col,
        length: n,
        domNode: cell,
      });

      dataRow.push(dataCell);
      row.appendChild(cell);
    }

    grid.push(dataRow);
    domGrid.appendChild(row);
  }

  return {grid};
}

function buildDomCell({ row, col }) {
  let cell = document.createElement("td");
  cell.className = `gridCell__${row}-${col}`;
  cell.style.height = "10px";
  cell.style.width = "10px";
  cell.style.backgroundColor = "black";

  return cell;
}

function Cell({ row, col, length, domNode }) {
  this.row = row;
  this.col = col;
  this.el = domNode;
  this.neighbors = this.determineNeighbors(length);
}

Cell.prototype.updateDOM = function(className) {
  if (this.square) {
    this.el.classList.add("square");
  } else {
    this.el.classList.remove("square");
  }

  // return this.el.classList.toggle(className);
};

Cell.prototype.determineNeighbors = function(length) {
  let neighborBuffer = [];

  // neighbor up
  let neighborRow = this.row - 1;
  if (neighborRow >= 0) {
    neighborBuffer.push({ row: neighborRow, col: this.col });
  }

  // neighbor down
  neighborRow = this.row + 1;
  if (neighborRow < length) {
    neighborBuffer.push({ row: neighborRow, col: this.col });
  }

  // neighbor left
  let neighborCol = this.col - 1;
  if (neighborCol >= 0) {
    neighborBuffer.push({ row: this.row, col: neighborCol });
  }

  // neighborRight
  neighborCol = this.col + 1;
  if (neighborCol < length) {
    neighborBuffer.push({ row: this.row, col: neighborCol });
  }

  return neighborBuffer;
};



function generateSquares(n) {
  window.squares = [];

  for (let i = 0; i < n; i++) {
    let square = new Square();
    window.squares.push(square);
  }
}

function paint() {
  clearGrid();
  for (let i = 0, l = window.squares.length; i < l; i++) {
    window.squares[i].color();
  }
}

function clearGrid() {
  for (let i = 0, l = window.grid.grid.length; i < l; i++) {
    for (let j = 0; j < l; j++) {
      window.grid.grid[i][j].el.style.backgroundColor = "black";
      window.grid.grid[i][j].el.style.borderBottom = "1px solid grey";
      window.grid.grid[i][j].el.style.borderRight = "1px solid grey";
    }
  }
}

function Square() {
  let square = {};
  let gridCenter = Math.floor(window.grid.grid.length / 2);
  let center = window.grid.grid.length / 2;

  this.height = Math.floor(Math.random() * 6) + 3;
  this.width = Math.floor(Math.random() * 6) + 3;
  this.point = {
    row: gridCenter - Math.floor(this.height / 2),
    col: gridCenter - Math.floor(this.width / 2),
  };
  this.bgColor = `rgb(${Math.floor(Math.random() * 255 + 1)}, ${Math.floor(Math.random() * 255 + 1)}, ${Math.floor(Math.random() * 255 + 1)})`;
}

Square.prototype.color = function() {
  for (let i = 0, l = this.height; i < l; i++) {
    for (let j = 0, l = this.width; j < l; j++) {
      let gridPoint = window.grid.grid[this.point.row + i][this.point.col + j].el;
      if (!gridPoint) { debugger }
      gridPoint.style.backgroundColor = this.bgColor;
      gridPoint.style.borderBottom = `1px solid ${this.bgColor}`;
      gridPoint.style.borderRight = `1px solid ${this.bgColor}`;
    }
  }
}

function minMaxGrid(untilIndex) {
  let top = 999, right = 0, bottom = 0, left = 999;
  for (let i = 0, l = window.squares.length; i < l; i++) {
    if (i >= untilIndex) { return {top, right, bottom, left} }
    let sq = window.squares[i];
    if (sq.point.row < top) {
      top = sq.point.row;
    }

    if (sq.point.col < left) {
      left = sq.point.col;
    }

    if (sq.point.row + sq.height > bottom) {
      bottom = sq.point.row + sq.height;
    }

    if (sq.point.col + sq.width > right) {
      right = sq.point.col + sq.width;
    }
  }
  return {
    top, right, bottom, left
  }
}

function moveEachSquare() {
  for (let i = 1, l = window.squares.length; i < l; i++) {
    const borders = minMaxGrid(i);

    let sq = window.squares[i];
    let newPoint, distance, moveLengths;
    newPoint = {};
    distance = [];

    newPoint.row = borders.top - sq.height;
    newPoint.col = sq.point.col;
    distance.push(["top", calcDistance(sq.point, newPoint)]);

    newPoint.row = borders.bottom;
    newPoint.col = sq.point.col;
    distance.push(["bottom", calcDistance(sq.point, newPoint)]);

    newPoint.row = sq.point.row;
    newPoint.col = borders.right;
    distance.push(["right", calcDistance(sq.point, newPoint)]);

    newPoint.row = sq.point.row;
    newPoint.col = borders.left - sq.width;
    distance.push(["left", calcDistance(sq.point, newPoint)]);

    distance.sort((a, b) => {
      return a[1] - b[1];
    })

    //console.log(distance);

    switch(distance[0][0]) {
      case "top":
        sq.point.row = borders.top - sq.height;

      break;
      case "right":
        sq.point.col = borders.right;

      break;
      case "bottom":
        sq.point.row = borders.bottom;

      break;
      case "left":
        sq.point.col = borders.left - sq.width;

      break;
    }
  }
  setTimeout(paint, 2000);
}

function calcDistance(oldPoint, newPoint) {
  let y = oldPoint.row - newPoint.row;
  y = Math.abs(y) * Math.abs(y);

  let x = oldPoint.col - newPoint.col;
  x = Math.abs(x) * Math.abs(x);

  return Math.sqrt(x + y);
}
