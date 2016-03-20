import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery-browserify';
import MediaQuery from 'react-responsive';
import CellView from './CellView.jsx';
import TileView from './TileView.jsx';
import Board from './Board.jsx';
import InfoBar from './InfoBar.jsx';

const styles = {
    main: {
        height: 'calc(100vh - 60px)',
        width: '100vw',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center'
    }
};

export default class BoardView extends React.Component {
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
                <div className="board">
                    {cellViews}
                    {tileViews}
                    {mergedTile}
                </div>
                <MediaQuery minHeight={500}>
                    <InfoBar score={this.props.score}
                             movement={this.props.movement}
                             currentFrame={this.props.currentFrame}>
                    </InfoBar>
                </MediaQuery>
            </div>
        );
    }
}
