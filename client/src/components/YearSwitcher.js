import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';

export default class YearSwitcher extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inputValue: props.year
        }
        
        this.handleInputChange = this.handleInputChange.bind(this);
        this.shiftByOne = this.shiftByOne.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

	handleInputChange({ target: { value } }) {
		this.setState({ inputValue: value });
    }
    
    shiftByOne({ target: { id } }) {
        const newYear = id === 'subtract'
            ? this.props.year - 1
            : this.props.year + 1;
        this.setState({ inputValue: newYear }, () => {
            this.props.updateYear(newYear);
        });
    }

    handleSubmit() {
        if (parseInt(this.state.inputValue, 10)) {
            this.props.updateYear(parseInt(this.state.inputValue, 10));
        }
    }
    
    handleKeyPress({ charCode }) {
		if (charCode === 13) {
			this.handleSubmit();
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
                    onClick={this.handleSubmit}
                >
                    Submit
                </button>
            </React.Fragment>
        );
    }
};
