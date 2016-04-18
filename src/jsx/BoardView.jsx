import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery-browserify';
import MediaQuery from 'react-responsive';

import CellView from './CellView.jsx';
import TileView from './TileView.jsx';
import InfoBar from './InfoBar.jsx';
import DebugBar from './DebugBar.jsx';

import { connect } from 'react-redux';

const styles = {
    main: {
        width: '100vw',
        height: 'calc(100vh - 60px)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center'
    },
    board: {
        width: '68vh',
        height: '68vh',
        padding: '1vh',
        borderRadius: '1vh',
        backgroundColor: 'rgba(230, 230, 230, 0.2)',
        outline: 'none',
        position: 'relative',
        cursor: 'default'
    }
};

class BoardView extends React.Component {
    constructor() {
        super();
    }
    render() {
        var cellViews = this.props.cells.map((row, i) => (
            row.map((cell, j) => (
                <CellView key={`cell${i}${j}`} />
            ))
        ));
        var tileViews = this.props.tiles.map((row, i) => (
            row.map((tile, j) => (
                tile.value == 0 ? null : <TileView key={`tile${i}${j}`} tile={tile}/>
            ))
        ));
        var mergedTile = this.props.mergedTiles.map((tile, i) => (
            <TileView key={`tile${i}`} tile={tile}/>
        ));
        return (
            <div style={styles.main}>
                <MediaQuery minHeight={500}>
                    <InfoBar />
                </MediaQuery>
                <div style={styles.board}>
                    {cellViews}
                    {tileViews}
                    {mergedTile}
                </div>
                <MediaQuery minHeight={500}>
                    <DebugBar />
                </MediaQuery>
            </div>
        );
    }
}

export default connect (
    function stateToProps(state) {
        return {
            cells: state.cells,
            tiles: state.tiles,
            mergedTiles: state.mergedTiles
        };
    }
)(BoardView);
