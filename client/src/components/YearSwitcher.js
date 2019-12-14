import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';

export default class YearSwitcher extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            inputValue: props.year
        }
        
        this.handleInputChange = this.handleInputChange.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.shiftByOne = this.shiftByOne.bind(this);
    }

	handleInputChange({ target: { value } }) {
		this.setState({ inputValue: parseInt(value, 10) });
    }
    
    shiftByOne({ target: { id } }) {
		const inputValue = id === 'subtract'
			? this.state.inputValue - 1
            : this.state.inputValue + 1;
		this.setState({ inputValue }, () => {
			this.props.updateYear(this.state.inputValue);
		});
    }
    
    handleKeyPress({ charCode }) {
		if (charCode === 13) {
			this.props.updateYear(this.state.inputValue);
		}
	}

    render() {
        return (
            <React.Fragment>
                <label htmlFor="year-input">Year: </label>
                <input
                    type="text"
                    id="year-input"
                    name="year"
                    value={this.state.inputValue}
                    onChange={this.handleInputChange}
                    onKeyPress={this.handleKeyPress}
                />
                <br />
                <br />
                <button
                    id="subtract"
                    onClick={this.shiftByOne}
                >
                    <FontAwesomeIcon icon={faCaretLeft} className="caret-left" />
                    {this.props.year - 1}
                </button>
                <button
                    id="add"
                    onClick={this.shiftByOne}
                >
                    {this.props.year + 1}
                    <FontAwesomeIcon icon={faCaretRight} className="caret-right" />
                </button>
                <br />
                <br />
                <button
                    onClick={() => this.props.updateYear(this.state.inputValue)}
                >
                    Submit
                </button>
            </React.Fragment>
        );
    }
};
