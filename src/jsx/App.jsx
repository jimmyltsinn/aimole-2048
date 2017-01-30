import React from 'react';
import { render } from 'react-dom';

import BoardView from './BoardView.jsx';
import Player from './Player.jsx';

import { Provider } from 'react-redux';
import store from '../redux/store.js';

import injectTapEventPlugin from 'react-tap-event-plugin';
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

class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <div style={styles.main}>
                    <BoardView />
                    <Player style={styles.player}/>
                </div>
            </Provider>
        );
    }
}

render(<App />, document.getElementById('main'));
