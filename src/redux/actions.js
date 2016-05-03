let { aimole, display } = require('../aimole.js');

export const RECEIVE_DATA = 'action: receive data';
const receiveData = data => ({ type: RECEIVE_DATA, data });

export const fetchData = () => {
    let data = display && display.length > 0 ? display: [];
    return function(dispatch) {
        dispatch(receiveData(data));
    };
};

export const RECEIVE_FRAME = 'actions: receive frame';
const receiveFrame = data => ({ type: RECEIVE_FRAME, data });

export const END_STREAM = 'actions: end streaming';
const endStream = () => ({ type: END_STREAM });

export const startStream = () => {
    return function(dispatch) {
        aimole.on('display', e => {
            dispatch(receiveFrame(e));
        });
        aimole.on('end', e => {
            dispatch(endStream());
        });
    };
};

export const QUEUEING = 'actions: queueing';
const queueing = () => ({ type: QUEUEING});

export const queueingStream = () => {
    // console.log("queueingStream");
    return function(dispatch) {
        // console.log("queueingStream dispatch");
        aimole.on('queueing', e => {
            // console.log("action receive queueingStream");
            dispatch(queueing());
        });
    };
};

export const ERR = 'actions: err';
const err = data => ({ type: ERR, data });

export const errStream = () => {
    return function(dispatch) {
        aimole.on('err', e => {
            dispatch(err(e));
        });
    };
};

export const SET_CURRENT_FRAME = 'action: set current frame';
export const setCurrentFrame = data => ({ type: SET_CURRENT_FRAME, data });

export const SET_PLAY = 'action: set play';
export const setPlay = data => ({ type: SET_PLAY, data });

export const SET_FIRST_CHANGE = 'action: set first change';
export const setFirstChange = data => ({ type: SET_FIRST_CHANGE, data });

export const SET_NEED_RESTART = 'action: set need restart';
export const setNeedRestart = data => ({ type: SET_NEED_RESTART, data });

export const MOVE_TILES = 'action: move tiles';
export const moveTiles = data => ({ type: MOVE_TILES, data });
