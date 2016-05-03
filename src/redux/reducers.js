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
    playerName: ['?'],
    ended: false,
    firstChange: true,
    needRestart: false,
    hasSenderMessage: false,
    senderMessage: ""
};

export default function reducer(prevState, action) {
    let state = _.clone(prevState) || initialState;

    switch(action.type) {

        case actions.RECEIVE_DATA:
            if (action.data && action.data.length > 0) {
                state.senderMessage = "";
                state.hasSenderMessage = false;
                state.initialized = true;
                state.data = action.data;
                state.totalFrame = action.data.length;
                if (action.data[0].players && action.data[0].players[0]) {
                    state.record = action.data[0].players[0].eloScore;
                    state.playerName = action.data[0].players[0].name;
                }
                state.ended = true;
            }
            return state;

        case actions.RECEIVE_FRAME:
            state.senderMessage = "";
            state.hasSenderMessage = false;
            state.initialized = true;
            state.data.push(action.data);
            if (state.data && state.data.length > 0 && state.data[0].players) {
                state.playerName = state.data[0].players[0].name;
                state.record = state.data[0].players[0].eloScore;
            }
            state.totalFrame = state.data.length;
            if (state.needRestart == true) {
                state.firstChange = true;
                state.needRestart = false;
            }
            return state;

        case actions.END_STREAM:
            state.ended = true;
            return state;

        case actions.QUEUEING:
            // console.log("reducer receive queueingStream");
            state.senderMessage = "Game is Running. Please Wait a Second!";
            state.hasSenderMessage = true;
            // console.log(state.senderMessage);
            return state;

        case actions.ERR:
            // console.log("err");
            state.senderMessage = "Error! Please Submit Again.";
            state.hasSenderMessage = true;
            return state;

        case actions.SET_CURRENT_FRAME:
            var newFrame = action.data;
            if (newFrame <= 0) {
                newFrame = 0;
            }
            else if (state.ended && newFrame > state.totalFrame - 1) {
                state.playing = false;
                newFrame = state.totalFrame - 1;
            }
            else if (!state.ended && newFrame > state.totalFrame - 1) {
                newFrame = state.currentFrame;
            }
            if (state.data.length > 0) {
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
            }
            return state;

        case actions.SET_PLAY:
            state.playing = action.data;
            return state;

        case actions.SET_FIRST_CHANGE:
            state.firstChange = action.data;
            return state;

        case actions.SET_NEED_RESTART:
            state.needRestart = action.data;
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
