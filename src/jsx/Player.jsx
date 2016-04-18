import React from 'react';
import _ from 'lodash';
import $ from 'jquery-browserify';
import marked from 'marked';

import {Paper, FloatingActionButton, FontIcon, IconButton, Slider, Dialog} from 'material-ui';
import spec from './spec.js';

import { connect } from 'react-redux';
import { fetchData, setCurrentFrame, setPlay, moveTiles } from '../redux/actions.js';

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

let firstChange = true;

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
        this.props.setPlay(true);
        this.props.setCurrentFrame(this.props.currentFrame);
        setTimeout(() => {
            if (this.props.currentFrame < this.props.totalFrame - 1) {
                this.props.moveTiles(this.props.data[this.props.currentFrame + 1].movement);
            }
        }, 300);
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
        firstChange = true;
        this.props.setPlay(!this.props.playing);
        setTimeout(() => {
            if (this.props.currentFrame < this.props.totalFrame - 1) {
                this.props.moveTiles(this.props.data[this.props.currentFrame + 1].movement);
            }
        }, 300);
    }
    handleSliderChange(e, val) {
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
        if (firstChange || (
            !_.isEqual(prevProps.cells, this.props.cells)
            && this.props.playing
            && this.props.currentFrame < this.props.totalFrame - 1)
           ) {
            setTimeout(() => {
                if (this.props.playing) {
                    if (firstChange) {
                        this.props.setCurrentFrame(this.props.currentFrame - 1);
                        this.props.setCurrentFrame(this.props.currentFrame + 1);
                    }
                    else {
                        this.props.setCurrentFrame(this.props.currentFrame + 1);
                    }
                    setTimeout(() => {
                        if (this.props.currentFrame < this.props.totalFrame - 1) {
                            this.props.moveTiles(this.props.data[this.props.currentFrame + 1].movement);
                        }
                    }, 300);
                }
            }, 700);
            firstChange = false;
        }
    }
    render() {
        let { initialized, currentFrame, totalFrame, playing } = this.props;
        let begin = (currentFrame === 0);
        let end = (currentFrame >= totalFrame - 1);

        return (
            <Paper style={styles.player}>
                <IconButton
                    iconClassName="material-icons"
                    disabled={!this.props.initialized || begin}
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
                    disabled={!this.props.initialized || end}
                    onTouchTap={this.handleNext}>
                    fast_forward
                </IconButton>

                <div style={styles.sliderContainer}>
                    <Slider
                        style={styles.slider}
                        disabled={!this.props.initialized}
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
                    tooltipPosition="top-right"
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
            playing: state.playing
        };
    },
    function dispatchToProps(dispatch) {
        return {
            fetchData: () => dispatch(fetchData()),
            setCurrentFrame: val => dispatch(setCurrentFrame(val)),
            setPlay: val => dispatch(setPlay(val)),
            moveTiles: val => dispatch(moveTiles(val))
        };
    }
)(Player);
