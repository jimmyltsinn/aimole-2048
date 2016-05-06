import React from 'react';
import $ from 'jquery-browserify';
import { FontIcon } from 'material-ui';

import { connect } from 'react-redux';

const styles = {
    output: {
        marginRight: '40px',
        display: 'flex',
        alignItems: 'center'
    },
    img: {
        verticalAlign: 'text-top'
    }
}

const getColor = (frame, currentFrame) => {
    var text = {
        width: '10vw',
        fontSize: '3vh',
        color: 'white',
        fontWeight: 'lighter',
        Align: 'center',
        textShadow: '0 3px 6px rgba(0,0,0,0.16)',
        whiteSpace: 'nowrap'
    };

    if (frame == currentFrame) {
        text.textShadow = '0 4px 10px #ffff99',
        text.color = '#ffff00'
    }
    return text;
}

class OutputView extends React.Component {
    render() {
        let output = "help_outline";
        if (this.props.output == 0) {
            output = "arrow_back";
        }
        else if (this.props.output == 1) {
            output = "arrow_upward";
        }
        else if (this.props.output == 2) {
            output = "arrow_forward";
        }
        else if (this.props.output == 3) {
            output = "arrow_downward";
        }
        let frame = this.props.number;
        return (
            <div id={`output${frame}`} style={styles.output}>
                <div style={getColor(frame, this.props.currentFrame + 1)}>
                    {frame} : <i className="material-icons" style={styles.img}>{output}</i>
                </div>
            </div>
        )
    }
}

export default connect (
    function stateToProps(state) {
        return {
            currentFrame: state.currentFrame
        };
    }
)(OutputView);
