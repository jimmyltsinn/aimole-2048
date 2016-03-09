import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import BoardView from './BoardView.jsx';
import Player from './Player.jsx';
import Data from './Data.jsx';
injectTapEventPlugin();

const styles = {
    main: {
        width: '100vw',
        height: 'calc(100vh - 60px)',
        background: 'radial-gradient(#E5FBD5, #0A6D88)'
    },
    player: {
        width: '100vw'
    }
};

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

var rotateLeft = function(matrix) {
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

var moveLeft = function(tiles, direction, mergedTile) {
    switch (direction) {
        case 0:
            var count, currentRow, currentTile;
            for (var row = 0; row < 4; ++row) {
                count = 0;
                currentRow = tiles[row].filter((tile) => (tile.value != 0));
                for (var col = 0; col < 4; ++col) {
                    if (currentRow.length > 0 && col == currentRow[0].col) {
                        tiles[row][col].direction = 0;
                        tiles[row][col].oldRow = tiles[row][col].row;
                        tiles[row][col].oldCol = tiles[row][col].col;
                        tiles[row][col].col = count;
                        currentTile = currentRow.shift();
                        if (currentRow.length > 0 && currentTile.value == currentRow[0].value) {
                            tiles[row][currentRow[0].col].direction = 0;
                            tiles[row][currentRow[0].col].oldRow = tiles[row][currentRow[0].col].row;
                            tiles[row][currentRow[0].col].oldCol = tiles[row][currentRow[0].col].col;
                            tiles[row][currentRow[0].col].col = count;
                            currentRow.shift();
                            mergedTile.push(new Tile(currentTile.value + currentTile.value, row, count, 2));
                        }
                        count = count + 1;
                    }
                }
            }
            return tiles;
        case 1:
            var count, currentRow, currentTile;
            for (var row = 0; row < 4; ++row) {
                count = 0;
                currentRow = tiles[row].filter((tile) => (tile.value != 0));
                for (var col = 0; col < 4; ++col) {
                    if (currentRow.length > 0 && col == currentRow[0].row) {
                        tiles[row][col].direction = 1;
                        tiles[row][col].oldRow = tiles[row][col].row;
                        tiles[row][col].oldCol = tiles[row][col].col;
                        tiles[row][col].row = count;
                        currentTile = currentRow.shift();
                        if (currentRow.length > 0 && currentTile.value == currentRow[0].value) {
                            tiles[row][currentRow[0].row].direction = 1;
                            tiles[row][currentRow[0].row].oldRow = tiles[row][currentRow[0].row].row;
                            tiles[row][currentRow[0].row].oldCol = tiles[row][currentRow[0].row].col;
                            tiles[row][currentRow[0].row].row = count;
                            currentRow.shift();
                            mergedTile.push(new Tile(currentTile.value + currentTile.value, count, 3 - row, 2));
                        }
                        count = count + 1;
                    }
                }
            }
            return tiles;
        case 2:
            var count, currentRow, currentTile;
            for (var row = 0; row < 4; ++row) {
                count = 3;
                currentRow = tiles[row].filter((tile) => (tile.value != 0));
                for (var col = 0; col < 4; ++col) {
                    if (currentRow.length > 0 && col == (3 - currentRow[0].col)) {
                        tiles[row][col].direction = 2;
                        tiles[row][col].oldRow = tiles[row][col].row;
                        tiles[row][col].oldCol = tiles[row][col].col;
                        tiles[row][col].col = count;
                        currentTile = currentRow.shift();
                        if (currentRow.length > 0 && currentTile.value == currentRow[0].value) {
                            tiles[row][(3 - currentRow[0].col)].direction = 2;
                            tiles[row][(3 - currentRow[0].col)].oldRow = tiles[row][(3 - currentRow[0].col)].row;
                            tiles[row][(3 - currentRow[0].col)].oldCol = tiles[row][(3 - currentRow[0].col)].col;
                            tiles[row][(3 - currentRow[0].col)].col = count;
                            currentRow.shift();
                            mergedTile.push(new Tile(currentTile.value + currentTile.value, 3 - row, count, 2));
                        }
                        count = count - 1;
                    }
                }
            }
            return tiles;
        case 3:
            var count, currentRow, currentTile;
            for (var row = 0; row < 4; ++row) {
                count = 3;
                currentRow = tiles[row].filter((tile) => (tile.value != 0));
                for (var col = 0; col < 4; ++col) {
                    if (currentRow.length > 0 && col == (3 - currentRow[0].row)) {
                        tiles[row][col].direction = 3;
                        tiles[row][col].oldRow = tiles[row][col].row;
                        tiles[row][col].oldCol = tiles[row][col].col;
                        tiles[row][col].row = count;
                        currentTile = currentRow.shift();
                        if (currentRow.length > 0 && currentTile.value == currentRow[0].value) {
                            tiles[row][(3 - currentRow[0].row)].direction = 3;
                            tiles[row][(3 - currentRow[0].row)].oldRow = tiles[row][(3 - currentRow[0].row)].row;
                            tiles[row][(3 - currentRow[0].row)].oldCol = tiles[row][(3 - currentRow[0].row)].col;
                            tiles[row][(3 - currentRow[0].row)].row = count;
                            currentRow.shift();
                            mergedTile.push(new Tile(currentTile.value + currentTile.value, count, row, 2));
                        }
                        count = count - 1;
                    }
                }
            }
            return tiles;
    }
}

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            mergedTile: [],
            tiles: [[],[],[],[]],
            cells: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
            data: [],
            submitted: false,
            currentFrame: 0,
            totalFrame: 0,
            playing: false
        };
        this.setCurrentFrame = this.setCurrentFrame.bind(this);
        this.setPlay = this.setPlay.bind(this);
        this.move = this.move.bind(this);
    }
    componentDidMount() {
        var iniTiles = [];
        for (var i = 0; i < 4; ++i) {
            iniTiles.push([]);
            for (var j = 0; j < 4; ++j) {
                iniTiles[i][j] = new Tile(0, i, j, 0);
            }
        }
        this.setState({
            data: Data,
            tiles: iniTiles,
            submitted: true,
            currentFrame: 0,
            totalFrame: Data.length,
            playing: true
        });
    }
    setPlay(newVal) {
        this.setState({playing: newVal});
    }
    move(direction) {
        var currentTiles = this.state.tiles;
        for (var i = 0; i < direction; ++i) {
            currentTiles = rotateLeft(currentTiles);
        }
        var mergedTiles = [];
        currentTiles = moveLeft(currentTiles, direction, mergedTiles);
        for (var i = direction; i < 4; ++i) {
            currentTiles = rotateLeft(currentTiles);
        }
        this.setState({tiles: currentTiles,
                       mergedTile: mergedTiles});
    }
    setCurrentFrame(newFrame) {
        if (newFrame < 0) {
            newFrame = 0;
        }
        else if (newFrame > this.state.totalFrame - 1) {
            newFrame = this.state.totalFrame - 1;
        }
        var currentTiles = [];
        for (var i = 0; i < 4; ++i) {
            currentTiles.push([]);
            for (var j = 0; j < 4; ++j) {
                if (i == this.state.data[newFrame].newTile[1]
                    && j == this.state.data[newFrame].newTile[0]) {
                    currentTiles[i][j] = new Tile(this.state.data[newFrame].board[i][j], i, j, 1);
                }
                else {
                    currentTiles[i][j] = new Tile(this.state.data[newFrame].board[i][j], i, j, 0);
                }
            }
        }
        this.setState({
            currentFrame: newFrame,
            cells: this.state.data[newFrame].board,
            tiles: currentTiles,
            mergedTile: []
        });
    };
    render() {
        return (
            <div style={styles.main}>
                <BoardView cells={this.state.cells}
                           tiles={this.state.tiles}
                           mergedTiles={this.state.mergedTile}/>
                <Player
                    cells={this.state.cells}
                    data={this.state.data}
                    move={this.move}
                    playing={this.state.playing}
                    setPlay={this.setPlay}
                    setCurrentFrame={this.setCurrentFrame}
                    currentFrame={this.state.currentFrame}
                    totalFrame={this.state.totalFrame}
                    submitted={this.state.submitted}
                    style={styles.player} />
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('main'));
