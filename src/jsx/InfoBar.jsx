import React from 'react';
import { connect } from 'react-redux';

const styles = {
    infoBar: {
        width: '76vw',
        height: '5vh',
        display: 'flex',
        justifyContent: 'center'
    },
    playerSection: {
        width: '30vh',
        display: 'flex',
        alignItems: 'center'
    },
    section: {
        width: '22vh',
        display: 'flex',
        alignItems: 'center'
    },
    text: {
        fontSize: '3vh',
        color: 'white',
        fontWeight: 'lighter',
        Align: 'center',
        textShadow: '0 3px 6px rgba(0,0,0,0.16)'
    }
}

class InfoBar extends React.Component {
    render() {
        return (
            <div style={styles.infoBar}>
                <div style={styles.playerSection}>
                    <div style={styles.text}>Player: <br/>{this.props.playerName}</div>
                </div>
                <div style={styles.section}>
                    <div style={styles.text}>Score: <br/>{this.props.score}</div>
                </div>
                <div style={styles.section}>
                    <div style={styles.text}>Elapsed: <br/>{this.props.totalTime/1000} s</div>
                </div>

            </div>
        );
    }
}

export default connect (
    function stateToProps(state) {
        return {
            score: state.score,
            record: state.record,
            totalTime: state.totalTime,
            playerName: state.playerName
        };
    }
)(InfoBar);
