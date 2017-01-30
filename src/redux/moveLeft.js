import Tile from './tile.js';

export default function(tiles, direction, mergedTile) {
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
