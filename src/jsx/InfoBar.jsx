import React from 'react';

const styles = {
    infoBar: {
        borderTop: '3px solid rgba(255, 255, 255, 0.5)',
        width: '76vw',
        display: 'flex',
        justifyContent: 'center'
    },
    separator: {
        borderLeft: '3px solid rgba(255, 255, 255, 0.5)',
        margin: '20px'
    },
    section: {
      display: 'flex',
      alignItems: 'center'
    },
    score: {
        fontSize: '6vh',
        color: 'white',
        fontWeight: 'lighter',
        width: '50vw',
        textAlign: 'right',
        textShadow: '0 3px 6px rgba(0,0,0,0.16)'
    },
    movement: {
        fontSize: '6vh',
        color: 'white',
        fontWeight: 'lighter',
        width: '50vw',
        textAlign: 'left',
        textShadow: '0 3px 6px rgba(0,0,0,0.16)'
    }
}

export default class InfoBar extends React.Component {
    render() {
        let move = "LEFT";
        if (this.props.movement == 1) {
            move = "UP";
        }
        else if (this.props.movement == 2) {
            move = "RIGHT";
        }
        else if (this.props.movement == 3) {
            move = "DOWN";
        }
        return (
            <div style={styles.infoBar}>
                <div style={styles.section}>
                    <div style={styles.score}>Score: {this.props.score}</div>
                </div>
                <div style={styles.separator} />
                <div style={styles.section}>
                    <div style={styles.movement}>Move: {move}</div>
                </div>
            </div>
        );
    }
}
