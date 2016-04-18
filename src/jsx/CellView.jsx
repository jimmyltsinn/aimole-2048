import React from 'react';

const styles = {
    cell: {
        width: '15vh',
        height: '15vh',
        margin: '1vh',
        borderRadius: '1vh',
        display: 'inline-block',
        float: 'left',
        backgroundColor: 'rgba(230, 230, 230, 0.1)',
        cursor: 'default'
    }
}

export default class CellView extends React.Component {
    render() {
        return (
            <div style={styles.cell}></div>
        )
    }
}
