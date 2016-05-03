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
        if (nextProps.ended && nextProps.currentFrame == nextProps.totalFrame - 1) {
            var mes = "";
            // console.log(nextProps.verdictMessage + "This Should Be Displayed");
            switch(nextProps.verdictMessage) {
                case 'terminated':
                    mes = "Your program terminated abnormally";
                    break;
                case 'timeout':
                    mes = "Timeout! Your program spent too much time on a move. The time limit is 0.8s.";
                    break;
                case 'error':
                    mes = "Your program has some unknown error.";
                    break;
                case 'invalid':
                    mes = "You made an invalid move, or there is still a valid move but you didn't make a move";
                    break;
                default:
                    mes = "Good Job! You got score " + nextProps.score;
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
                open={this.props.initialized ? this.state.show : this.props.hasSenderMessage}
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
                hasSenderMessage: state.hasSenderMessage
            };
        else
            return {
                initialized: state.initialized,
                senderMessage: state.senderMessage,
                hasSenderMessage: state.hasSenderMessage
            };
    }
)(Message);
