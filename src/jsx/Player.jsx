import React from 'react';
import _ from 'lodash';
import $ from 'jquery-browserify';
import marked from 'marked';
import SweetScroll from "sweet-scroll";

import {Paper, FloatingActionButton, FontIcon, IconButton, Slider, Dialog} from 'material-ui';
import spec from './spec.js';

import { connect } from 'react-redux';
import { fetchData, startStream, setCurrentFrame, setPlay, setFirstChange, setNeedRestart, moveTiles, queueingStream, errStream } from '../redux/actions.js';

const sweetScroll = new SweetScroll({
    horizontalScroll: true,
    easing: "linear",
    duration: 600
}, "#debugBar");

const styles = {
    player: {
        padding: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    sliderContainer: {
        marginLeft: '15px',
        width: '300px',
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
    },
    specToggle: {
        margin: '0 0 0 40px'
    },
    specIcon: {
        color: 'grey'
    },
    spec: {
        fontFamily: 'sans-serif',
        overflow: 'scroll',
        height: '90vh',
        whiteSpace: 'normal',
        margin: '20px 0px 20px 0px',
    }
};

class Player extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
        _.bindAll(this, [
            'handlePrev',
            'handleNext',
            'handlePlay',
            'handleSliderChange',
            'handleSpecToggle'
        ]);
    }
    componentWillMount() {
        this.props.fetchData();
        this.props.startStream();
        this.props.queueingStream();
        this.props.errStream();
        this.props.setPlay(true);
        this.props.setCurrentFrame(this.props.currentFrame);
        setTimeout(() => {
            if (this.props.currentFrame < this.props.totalFrame - 1) {
                this.props.moveTiles(this.props.data[this.props.currentFrame + 1].movement);
            }
        }, 300);
    }
    handlePrev() {
        var frame = Math.floor(this.props.currentFrame - 1);
        sweetScroll.toElement(document.getElementById(`output${frame}`));
        this.props.setCurrentFrame(this.props.currentFrame - 1);
        this.props.setPlay(false);
    }
    handleNext() {
        var frame = Math.floor(this.props.currentFrame + 1);
        sweetScroll.toElement(document.getElementById(`output${frame}`));
        this.props.setCurrentFrame(this.props.currentFrame + 1);
        this.props.setPlay(false);
    }
    handlePlay() {
        this.props.setFirstChange(true);
        this.props.setPlay(!this.props.playing);
        setTimeout(() => {
            if (this.props.currentFrame < this.props.totalFrame - 1) {
                this.props.moveTiles(this.props.data[this.props.currentFrame + 1].movement);
            }
        }, 300);
    }
    handleSliderChange(e, val) {
        var frame = Math.floor(val * this.props.totalFrame);
        sweetScroll.toElement(document.getElementById(`output${frame}`));
        this.props.setCurrentFrame(Math.floor(val * this.props.totalFrame));
        this.props.setPlay(false);
    }
    handleSpecToggle(e) {
        this.props.setPlay(false);
        this.setState({
            open: !this.state.open,
            archor: e.currentTarget
        });
    }
    componentDidUpdate(prevProps) {
        if ((this.props.firstChange || !_.isEqual(prevProps.cells, this.props.cells))
            && this.props.playing
            && this.props.currentFrame < this.props.totalFrame - 1
           ) {
            // console.log("Frame: " + this.props.currentFrame + 1);
            this.props.setNeedRestart(false);

            setTimeout(() => {
                if (this.props.playing) {
                    if (this.props.firstChange) {
                        this.props.setCurrentFrame(this.props.currentFrame - 1);
                        this.props.setCurrentFrame(this.props.currentFrame + 1);
                    }
                    else {
                        this.props.setCurrentFrame(this.props.currentFrame + 1);
                    }
                    var frame = this.props.currentFrame + 1;
                    if ((frame % 4) == 0) {
                        sweetScroll.toElement(document.getElementById(`output${frame}`));
                    }
                    if (this.props.data[this.props.currentFrame + 1] && this.props.data[this.props.currentFrame + 1].message == 'player') {
                        setTimeout(() => {
                            if (this.props.currentFrame < this.props.totalFrame - 1) {
                                this.props.moveTiles(this.props.data[this.props.currentFrame + 1].movement);
                            }
                        }, 300);
                    }
                }
            }, 700);
            this.props.setFirstChange(false);

        }
        else if (!this.props.ended && this.currentFrame >= this.totalFrame - 1) {
            this.props.setNeedRestart(true);
            // console.log("setNeedRestart");
        }
    }
    render() {
        let begin = (this.props.currentFrame === 0);
        let end = (this.props.currentFrame >= this.props.totalFrame - 1);

        return (
            <Paper style={styles.player}>
                <IconButton
                    iconClassName="material-icons"
                    disabled={!this.props.initialized || begin || !this.props.ended}
                    onTouchTap={this.handlePrev}>
                    fast_rewind
                </IconButton>

                <FloatingActionButton
                    disabled={!this.props.initialized || end}
                    onTouchTap={this.handlePlay}
                    mini={true}
                    primary={true}>
                    <FontIcon className="material-icons">
                        {this.props.playing? 'pause' : 'play_arrow'}
                    </FontIcon>
                </FloatingActionButton>

                <IconButton
                    iconClassName="material-icons"
                    disabled={!this.props.initialized || !this.props.ended}
                    onTouchTap={this.handleNext}>
                    fast_forward
                </IconButton>

                <div style={styles.sliderContainer}>
                    <Slider
                        style={styles.slider}
                        disabled={!this.props.initialized || !this.props.ended}
                        onChange={this.handleSliderChange}
                        value={this.props.currentFrame/(this.props.totalFrame - 1)}
                        step={1/(this.props.totalFrame - 1)}/>
                </div>

                <p style={styles.label}>
                    {this.props.initialized? `${this.props.currentFrame + 1}/${this.props.totalFrame}`: '-/-'}
                </p>

                <IconButton
                    style={styles.specToggle}
                    iconStyle={styles.specIcon}
                    iconClassName="material-icons"
                    tooltip={<p>Game Rules</p>}
                    tooltipPosition="top-left"
                    onTouchTap={this.handleSpecToggle}>
                    insert_comment
                </IconButton>

                <Dialog
                    modal={false}
                    bodyStyle={styles.spec}
                    bodyClassName="markdown-body"
                    open={this.state.open}
                    onRequestClose={this.handleSpecToggle}>
                    <div dangerouslySetInnerHTML={{
                        __html: marked(spec.message)
                    }} />
                </Dialog>

            </Paper>
        );
    }
}

export default connect (
    function stateToProps(state) {
        return {
            initialized: state.initialized,
            cells: state.cells,
            data: state.data,
            currentFrame: state.currentFrame,
            totalFrame: state.totalFrame,
            playing: state.playing,
            ended: state.ended,
            firstChange: state.firstChange
        };
    },
    function dispatchToProps(dispatch) {
        return {
            fetchData: () => dispatch(fetchData()),
            startStream: () => dispatch(startStream()),
            setCurrentFrame: val => dispatch(setCurrentFrame(val)),
            setPlay: val => dispatch(setPlay(val)),
            setFirstChange: val => dispatch(setFirstChange(val)),
            setNeedRestart: val => dispatch(setNeedRestart(val)),
            moveTiles: val => dispatch(moveTiles(val)),
            queueingStream: val => dispatch(queueingStream(val)),
            errStream: val => dispatch(errStream(val))
        };
    }
)(Player);
