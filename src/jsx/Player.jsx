import React from 'react';
import {Paper, FloatingActionButton, FontIcon, IconButton, Slider} from 'material-ui';
import _ from 'lodash';

const styles = {
    player: {
        height: '60px',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    sliderContainer: {
        marginLeft: '15px',
        width: '200px',
        height: '18px'
    },
    slider: {
        margin: '0px'
    },
    label: {
        marginLeft: '20px',
        width: '15px',
        fontWeight: 'bold',
        color: 'grey'
    }
};

var first = true;

export default class Player extends React.Component {
    constructor(props) {
        super(props);
        _.bindAll(this, [
            'handlePrev',
            'handleNext',
            'handlePlay',
            'handleSliderChange'
        ]);
    }
    handlePrev() {
        this.props.setCurrentFrame(this.props.currentFrame - 1);
        this.props.setPlay(false);
    }
    handleNext() {
        this.props.setCurrentFrame(this.props.currentFrame + 1);
        this.props.setPlay(false);
    }
    handlePlay() {
        first = true;
        this.props.setPlay(!this.props.playing);
    }
    handleSliderChange(e, val) {
        this.props.setCurrentFrame(Math.floor(val * this.props.totalFrame));
        this.props.setPlay(false);
    }
    componentDidUpdate(prevProps) {
        if (first ||
            (!_.isEqual(prevProps.cells, this.props.cells)
             && this.props.playing
             && this.props.currentFrame + 1 < this.props.totalFrame)) {
            setTimeout(() => {
                if (this.props.playing) {
                    this.props.setCurrentFrame(this.props.currentFrame + 1);
                    setTimeout(() => {
                        this.props.move(this.props.data[this.props.currentFrame].movement);
                    }, 300);
                }
            }, 700);
            first = false;
        }
    }
    render() {
        return (
            <Paper style={styles.player}>
                <IconButton
                    disabled={!this.props.submitted}
                    onTouchTap={this.handlePrev}
                    iconClassName="material-icons">
                    fast_rewind
                </IconButton>

                <FloatingActionButton
                    disabled={!this.props.submitted}
                    onTouchTap={this.handlePlay}
                    mini={true}
                    primary={true}>
                    <FontIcon className="material-icons">
                        {this.props.playing? 'pause' : 'play_arrow'}
                    </FontIcon>
                </FloatingActionButton>

                <IconButton
                    disabled={!this.props.submitted}
                    onTouchTap={this.handleNext}
                    iconClassName="material-icons">
                    fast_forward
                </IconButton>

                <div style={styles.sliderContainer}>
                    <Slider
                        disabled={!this.props.submitted}
                        onChange={this.handleSliderChange}
                        value={this.props.currentFrame/(this.props.totalFrame-1)}
                        step={1/(this.props.totalFrame-1)}
                        style={styles.slider} />
                </div>

                <p style={styles.label}>
                    {this.props.submitted? `${this.props.currentFrame + 1}/${this.props.totalFrame}`: '-/-'}
                </p>
            </Paper>
        );
    }
}
