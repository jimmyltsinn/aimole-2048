export const RECEIVE_DATA = 'action: receive data';
const receiveData = data => ({ type: RECEIVE_DATA, data });

export const fetchData = () => {
    let data = window.aimole.display && window.aimole.display.length > 0 ? window.aimole.display: [];
    return function(dispatch) {
        dispatch(receiveData(data));
    };
};

export const SET_CURRENT_FRAME = 'action: set current frame';
export const setCurrentFrame = data => ({ type: SET_CURRENT_FRAME, data });

export const SET_PLAY = 'action: set play';
export const setPlay = data => ({ type: SET_PLAY, data });

export const MOVE_TILES = 'action: move tiles';
export const moveTiles = data => ({ type: MOVE_TILES, data });
