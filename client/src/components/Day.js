import React from 'react';
import '../css/Day.css';

class Day extends React.Component {
    render() {
        return (
            <td>
                <button
                    className="dayButton"
                    onClick={this.handleClick}
                >
                    {this.props.day}
                    {this.props.starred && <span className="star">{this.props.stars.join(', ')}</span>}
                </button>
            </td>
        );
    }
};

export default Day;
