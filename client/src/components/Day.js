import React from 'react';
import '../css/Day.css';

class Day extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            starred: false
        }

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState(state => ({
            starred: !state.starred
        }));
    }

    render() {
        return (
            <td>
                <button
                    className="dayButton"
                    onClick={this.handleClick}
                >
                    {this.props.day}
                    {this.state.starred && <span className="star">Star</span>}
                </button>
            </td>
        );
    }
};

export default Day;
