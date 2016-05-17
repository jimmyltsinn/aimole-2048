import React from 'react';
import { Dialog, FlatButton } from 'material-ui';

import { connect } from 'react-redux';

const styles = {
    error: {
        textAlign: 'left',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        KhtmlUserSelect: 'none',
        OUserSelect: 'none',
        MozUserSelect: 'none'
    }
};

class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            message: null
        };
    }

    componentWillReceiveProps(nextProps) {
        // console.log("Frame: " + nextProps.currentFrame + " Message: " + nextProps.verdictMessage);
        if (nextProps.ended && nextProps.currentFrame == nextProps.totalFrame - 1) {
            var mes = "";
            // console.log("Message: " + nextProps.verdictMessage + "!!!!!!!!!!!!!!!!!!!!!");
            switch(nextProps.verdictMessage) {
                case 'terminated':
                    mes = "Your program terminated abnormally";
                    break;
                case 'timeout':
                    mes = "Timeout! Your program spent too much time on a move. The time limit for each move is 2s.";
                    break;
                case 'error':
                    mes = "Your program has some unknown error.";
                    break;
                case 'invalid':
                    mes = "You made an invalid move.";
                    break;
                case 'ttle':
                    mes = "Total run time(2 minutes) is up. You got score " + nextProps.score;
                    break;
                default:
                    mes = "Good Job! You got score " + nextProps.score + ". The total run time you spent: " + nextProps.totalTime + " ms.";
            }
            this.setState({ show: true, message:  mes });
        }
        else {
            // console.log("not display this frame's message");
            this.setState({ show: false, message: null });
        }
    }

    render() {
        let actions = (
            <FlatButton
                label="Okay"
                primary={true}
                onTouchTap={() => {this.setState({show: false});}} />
        );
        return (
            <Dialog
                modal={false}
                actions={actions}
                open={this.state.show || this.props.hasSenderMessage}
                onRequestClose={() => {this.setState({show: false});}}>
                <h1 style={styles.error}>
                    {this.props.hasSenderMessage ? this.props.senderMessage : this.state.message}
                </h1>
            </Dialog>
        );
    }
}

export default connect (
    function stateToProps(state) {
        if (state.initialized && state.data[state.currentFrame])
            return {
                initialized: state.initialized,
                ended: state.ended,
                totalFrame: state.totalFrame,
                currentFrame: state.currentFrame,
                verdictMessage: state.data[state.currentFrame].message,
                score: state.score,
                senderMessage: state.senderMessage,
                hasSenderMessage: state.hasSenderMessage,
                totalTime: state.data[state.currentFrame].totalTime
            };
        else
            return {
                initialized: state.initialized,
                senderMessage: state.senderMessage,
                hasSenderMessage: state.hasSenderMessage
            };
    }
)(Message);
