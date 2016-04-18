import React from 'react';
import $ from 'jquery-browserify';

import OutputView from './OutputView.jsx';

import { connect } from 'react-redux';

const styles = {
    debugBar: {
        width: '76vw',
        height: '5vh',
        display: 'flex',
        justifyContent: 'left',
        overflowX: 'scroll'
    }
}

class DebugBar extends React.Component {
    render() {
        var outputView = this.props.data.map((data, i) => (
            i < this.props.totalFrame - 1 ?
            <OutputView key={`output${i}`} number={i + 1} output={this.props.data[i + 1].movement}/> : null
        ));
        return (
            <div style={styles.debugBar}>
                {outputView}
            </div>
        );
    }
}

export default connect (
    function stateToProps(state) {
        return {
            data: state.data,
            totalFrame: state.totalFrame
        };
    }
)(DebugBar);
