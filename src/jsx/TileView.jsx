import React from 'react';
import $ from 'jquery-browserify';

export default class TileView extends React.Component {
    render() {
        if (this.props.tile.direction == -1) {
            if (this.props.tile.newTile == 1) {
                return (
                    <div className={`tile tile${this.props.tile.value} new`}
                         style={{top: `${17 * this.props.tile.row + 1}vh`,
                                left: `${17 * this.props.tile.col + 1}vh`}}>
                        {this.props.tile.value}
                    </div>
                )
            }
            else if (this.props.tile.newTile == 2) {
                return (
                    <div className={`tile tile${this.props.tile.value} merged`}
                         style={{top: `${17 * this.props.tile.row + 1}vh`,
                                left: `${17 * this.props.tile.col + 1}vh`}}>
                        {this.props.tile.value}
                    </div>
                )
            }
            else {
                return (
                    <div className={`tile tile${this.props.tile.value}`}
                         style={{top: `${17 * this.props.tile.row + 1}vh`,
                                left: `${17 * this.props.tile.col + 1}vh`}}>
                        {this.props.tile.value}
                    </div>
                )
            }
        }
        else if (this.props.tile.direction == 0 || this.props.tile.direction == 2) {
            return (
                <div className={`tile tile${this.props.tile.value} col_from_${this.props.tile.oldCol}_to_${this.props.tile.col}`}
                     style={{top: `${17 * this.props.tile.row + 1}vh`,
                            left: `${17 * this.props.tile.col + 1}vh`}}>
                    {this.props.tile.value}
                </div>
            )
        }
        else if (this.props.tile.direction == 1 || this.props.tile.direction == 3) {
            return (
                <div className={`tile tile${this.props.tile.value} row_from_${this.props.tile.oldRow}_to_${this.props.tile.row}`}
                     style={{top: `${17 * this.props.tile.row + 1}vh`,
                            left: `${17 * this.props.tile.col + 1}vh`}}>
                    {this.props.tile.value}
                </div>
            )
        }
    }
}
