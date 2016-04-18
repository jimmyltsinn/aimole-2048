import * as actions from './actions.js';
import Tile from './tile.js';
import rotateLeft from './rotateLeft.js';
import moveLeft from './moveLeft.js';

import _ from 'lodash';
import $ from 'jquery-browserify';

let iniTiles = [];
for (var i = 0; i < 4; ++i) {
    iniTiles.push([]);
    for (var j = 0; j < 4; ++j) {
        iniTiles[i][j] = new Tile(0, i, j, 0);
    }
}
let initialState = {
    initialized: false,
    cells: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
    tiles: iniTiles,
    mergedTiles: [],
    score: 0,
    movement: -1,
    data: [],
    currentFrame: 0,
    totalFrame: 0,
    playing: false,
    record: 0,
    playerName: ['?']
};

export default function reducer(prevState, action) {
    let state = _.clone(prevState) || initialState;

    switch(action.type) {

        case actions.RECEIVE_DATA:
            if (action.data.length > 0) {
                state.initialized = true;
                state.data = action.data;
                state.totalFrame = action.data.length;
                state.record = action.data[0].players[0].eloScore;
                state.playerName = action.data[0].players[0].name;
            }
            return state;

        case actions.SET_CURRENT_FRAME:
            var newFrame = action.data;
            if (newFrame <= 0) {
                newFrame = 0;
            }
            else if (newFrame > state.totalFrame - 1) {
                state.playing = false;
                newFrame = state.totalFrame - 1;
            }
            var currentTiles = [];
            for (var i = 0; i < 4; ++i) {
                currentTiles.push([]);
                for (var j = 0; j < 4; ++j) {
                    if (i == state.data[newFrame].newTile[0]
                        && j == state.data[newFrame].newTile[1]) {
                        currentTiles[i][j] = new Tile(state.data[newFrame].board[i][j], i, j, 1);
                    }
                    else {
                        currentTiles[i][j] = new Tile(state.data[newFrame].board[i][j], i, j, 0);
                    }
                }
            }
            state.currentFrame = newFrame;
            state.cells = state.data[newFrame].board;
            state.tiles = currentTiles;
            state.score = state.data[newFrame].score;
            if (newFrame < state.totalFrame - 1) state.movement = state.data[newFrame + 1].movement;
            state.mergedTiles = [];
            return state;

        case actions.SET_PLAY:
            state.playing = action.data;
            return state;

        case actions.MOVE_TILES:
            var direction = action.data;
            var currentTiles = state.tiles;
            for (var i = 0; i < direction; ++i) {
                currentTiles = rotateLeft(currentTiles);
            }
            var mergedTiles = [];
            currentTiles = moveLeft(currentTiles, direction, mergedTiles);
            for (var i = direction; i < 4; ++i) {
                currentTiles = rotateLeft(currentTiles);
            }
            state.tiles = currentTiles;
            state.mergedTiles = mergedTiles;
            return state;

        default:
            return state;
    }
}
