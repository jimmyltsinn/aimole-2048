import React from 'react';
import $ from 'jquery-browserify';
import { FontIcon } from 'material-ui';

const styles = {
    output: {
        width: '22vh',
        marginRight: '40px',
        display: 'flex',
        alignItems: 'center'
    },
    text: {
        fontSize: '3vh',
        color: 'white',
        fontWeight: 'lighter',
        Align: 'center',
        textShadow: '0 3px 6px rgba(0,0,0,0.16)',
        whiteSpace: 'nowrap'
    }
}

export default class OutputView extends React.Component {
    render() {
        let output = "";
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
            <div ref={`output${frame}`} style={styles.output}>
                <div style={styles.text}>
                    {this.props.number} :  <i className="material-icons">{output}</i>
                </div>
            </div>
        )
    }
}
