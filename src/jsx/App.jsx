import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery-browserify';
import CellView from './CellView.jsx';
import TileView from './TileView.jsx';
import Data from './Data.jsx';

const styles = {
    main: {
        height: '80vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
};

export default class BoardView extends React.Component {
    constructor() {
        super();
        this.state = {
            board: new Board
        };
    }
    updateMove() {
        this.setState({board: this.state.board.move(this.state.board.data[this.state.board.currentFrame].movement)});
    }
    componentDidMount() {
        var changeFrame = setInterval(() => {
            if (this.state.board.currentFrame < this.state.board.totalFrame - 1) {
                this.setState({board: this.state.board.setCurrentFrame(this.state.board.currentFrame + 1)});
                setTimeout(() => {
                    this.updateMove();
                }, 600);
            }
            else {
                clearInterval(changeFrame);
            }
        }, 1000);
    }
    render() {
        var cellViews = this.state.board.data[this.state.board.currentFrame].board.map((row, i) => (
            row.map((cell, j) => (
                <CellView key={`cell${i}${j}`} />
            ))
        ));
        var tileViews = this.state.board.tiles.map((row, i) => (
            row.map((tile, j) => (
                tile.value == 0 ? null : <TileView key={`tile${i}${j}`} tile={tile}/>
            ))
        ));
        var mergedTile = this.state.board.mergedTile.map((tile, i) => (
            <TileView key={`tile${i}`} tile={tile}/>
        ));
        return (
          <div style={styles.main}>
              <div className="board">
                  {cellViews}
                  {tileViews}
                  {mergedTile}
              </div>
          </div>
        );
    }
}

var Board = function () {
    this.mergedTile = [];
    this.tiles = [];
    this.data = Data;
    this.new = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    var temp = 0;
    for (var i = 0; i < 4; ++i) {
        this.tiles[i] = [this.generateTile(temp += temp, i, 0, 0),
                         this.generateTile(temp += temp, i, 1, 0),
                         this.generateTile(temp += temp, i, 2, 0),
                         this.generateTile(temp += temp, i, 3, 0)];
    }
    this.currentFrame = 0;
    this.totalFrame = this.data.length;
};

Board.prototype.generateTile = function(value, row, col, isNew) {
    var tile = new Tile(value, row, col, isNew);
    return tile;
}

var Tile = function(value, row, col, isNew) {
    this.value = value;
    this.merged = 0;
    this.newVal = 0;
    this.row = row;
    this.col = col;
    this.oldRow = -1;
    this.oldCol = -1;
    this.direction = -1;
    this.newTile = isNew;
}

Board.prototype.setCurrentFrame = function(frameNum) {
    this.mergedTile = [];
    this.currentFrame = frameNum;
    this.new[this.data[this.currentFrame].newTile[1]][this.data[this.currentFrame].newTile[0]] = 1;
    for (var i = 0; i < 4; ++i) {
        for (var j = 0; j < 4; ++j) {
            if (this.new[i][j] == 0) {
                this.tiles[i][j] = this.generateTile(this.data[this.currentFrame].board[i][j], i, j, 0);
            }
            else {
                this.tiles[i][j] = this.generateTile(this.data[this.currentFrame].board[i][j], i, j, 1);
            }
        }
    }
    this.new = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    return this;
}

Board.prototype.move = function(direction) {
    for (var i = 0; i < direction; ++i) {
        this.tiles = rotateLeft(this.tiles);
    }
    this.moveLeft(direction);
    for (var i = direction; i < 4; ++i) {
        this.tiles = rotateLeft(this.tiles);
    }
    return this;
}

var rotateLeft = function (matrix) {
    var rows = matrix.length;
    var cols = matrix[0].length;
    var res = [];
    for (var row = 0; row < rows; ++row) {
        res.push([]);
        for (var col = 0; col < cols; ++col) {
            res[row][col] = matrix[col][cols - row - 1];
        }
    }
    return res;
};

Board.prototype.moveLeft = function(direction) {
    switch (direction) {
      case 0:
          var count, currentRow, currentTile;
          for (var row = 0; row < 4; ++row) {
              count = 0;
              currentRow = this.tiles[row].filter((tile) => (tile.value != 0));
              for (var col = 0; col < 4; ++col) {
                  if (currentRow.length > 0 && col == currentRow[0].col) {
                      this.tiles[row][col].direction = 0;
                      this.tiles[row][col].oldRow = this.tiles[row][col].row;
                      this.tiles[row][col].oldCol = this.tiles[row][col].col;
                      this.tiles[row][col].col = count;
                      currentTile = currentRow.shift();
                      if (currentRow.length > 0 && currentTile.value == currentRow[0].value) {
                          this.tiles[row][currentRow[0].col].direction = 0;
                          this.tiles[row][currentRow[0].col].oldRow = this.tiles[row][currentRow[0].col].row;
                          this.tiles[row][currentRow[0].col].oldCol = this.tiles[row][currentRow[0].col].col;
                          this.tiles[row][currentRow[0].col].col = count;
                          currentRow.shift();
                          this.mergedTile.push(new Tile(currentTile.value + currentTile.value, row, count, 2));
                      }
                      count = count + 1;
                  }
              }
          }
          break;
      case 1:
          var count, currentRow, currentTile;
          for (var row = 0; row < 4; ++row) {
              count = 0;
              currentRow = this.tiles[row].filter((tile) => (tile.value != 0));
              for (var col = 0; col < 4; ++col) {
                  if (currentRow.length > 0 && col == currentRow[0].row) {
                      this.tiles[row][col].direction = 1;
                      this.tiles[row][col].oldRow = this.tiles[row][col].row;
                      this.tiles[row][col].oldCol = this.tiles[row][col].col;
                      this.tiles[row][col].row = count;
                      currentTile = currentRow.shift();
                      if (currentRow.length > 0 && currentTile.value == currentRow[0].value) {
                          this.tiles[row][currentRow[0].row].direction = 1;
                          this.tiles[row][currentRow[0].row].oldRow = this.tiles[row][currentRow[0].row].row;
                          this.tiles[row][currentRow[0].row].oldCol = this.tiles[row][currentRow[0].row].col;
                          this.tiles[row][currentRow[0].row].row = count;
                          currentRow.shift();
                          this.mergedTile.push(new Tile(currentTile.value + currentTile.value, count, 3 - row, 2));
                      }
                      count = count + 1;
                  }
              }
          }
          break;
      case 2:
          var count, currentRow, currentTile;
          for (var row = 0; row < 4; ++row) {
              count = 3;
              currentRow = this.tiles[row].filter((tile) => (tile.value != 0));
              for (var col = 0; col < 4; ++col) {
                  if (currentRow.length > 0 && col == (3 - currentRow[0].col)) {
                      this.tiles[row][col].direction = 2;
                      this.tiles[row][col].oldRow = this.tiles[row][col].row;
                      this.tiles[row][col].oldCol = this.tiles[row][col].col;
                      this.tiles[row][col].col = count;
                      currentTile = currentRow.shift();
                      if (currentRow.length > 0 && currentTile.value == currentRow[0].value) {
                          this.tiles[row][(3 - currentRow[0].col)].direction = 2;
                          this.tiles[row][(3 - currentRow[0].col)].oldRow = this.tiles[row][(3 - currentRow[0].col)].row;
                          this.tiles[row][(3 - currentRow[0].col)].oldCol = this.tiles[row][(3 - currentRow[0].col)].col;
                          this.tiles[row][(3 - currentRow[0].col)].col = count;
                          currentRow.shift();
                          this.mergedTile.push(new Tile(currentTile.value + currentTile.value, 3 - row, count, 2));
                      }
                      count = count - 1;
                  }
              }
          }
          break;
      case 3:
          var count, currentRow, currentTile;
          for (var row = 0; row < 4; ++row) {
              count = 3;
              currentRow = this.tiles[row].filter((tile) => (tile.value != 0));
              for (var col = 0; col < 4; ++col) {
                  if (currentRow.length > 0 && col == (3 - currentRow[0].row)) {
                      this.tiles[row][col].direction = 3;
                      this.tiles[row][col].oldRow = this.tiles[row][col].row;
                      this.tiles[row][col].oldCol = this.tiles[row][col].col;
                      this.tiles[row][col].row = count;
                      currentTile = currentRow.shift();
                      if (currentRow.length > 0 && currentTile.value == currentRow[0].value) {
                          this.tiles[row][(3 - currentRow[0].row)].direction = 3;
                          this.tiles[row][(3 - currentRow[0].row)].oldRow = this.tiles[row][(3 - currentRow[0].row)].row;
                          this.tiles[row][(3 - currentRow[0].row)].oldCol = this.tiles[row][(3 - currentRow[0].row)].col;
                          this.tiles[row][(3 - currentRow[0].row)].row = count;
                          currentRow.shift();
                          this.mergedTile.push(new Tile(currentTile.value + currentTile.value, count, row, 2));
                      }
                      count = count - 1;
                  }
              }
          }
          break;
    }
}

ReactDOM.render(<BoardView/>, document.getElementById('main'));
