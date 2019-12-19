import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';

export default class YearSwitcher extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inputValue: props.year
        }
        
        this.formRef = React.createRef();

        this.handleInputChange = this.handleInputChange.bind(this);
        this.shiftByOne = this.shiftByOne.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

	handleInputChange({ target: { value } }) {
		this.setState({ inputValue: value.trim() });
    }
    
    shiftByOne({ target: { id } }) {
        const newYear = id === 'previous'
            ? this.props.year - 1
            : this.props.year + 1;
        this.setState({ inputValue: newYear }, () => {
            this.props.updateYear(newYear);
        });
    }

    handleSubmit(event) {
        const formIsValid = this.formRef.current.reportValidity();
        if (formIsValid) {
            event.preventDefault();
            this.props.updateYear(parseInt(this.state.inputValue, 10));
        }
    }
    
    handleKeyPress(event) {
		if (event.charCode === 13) {
			this.handleSubmit(event);
		}
	}

    render() {
        return (
            <div class="y-margin-15">
                <form ref={this.formRef} className="bottom-margin-17">
                    <label htmlFor="year-input">Year: </label>
                    <input
                        type="text"
                        id="year-input"
                        name="year"
                        className="right-margin-20 left-padding-3"
                        required
                        pattern="^([1-9][7-9][5-9][3-9]|[1-9][8-9][0-9]{2}|[2-9][0-9]{3}|[1-9]\d{4})$"
                        title="Please enter a valid year between 1753 and 99999, inclusive."
                        value={this.state.inputValue}
                        onChange={this.handleInputChange}
                        onKeyPress={this.handleKeyPress}
                    />
                    <button
                        type="submit"
                        onClick={this.handleSubmit}
                    >
                        Submit
                    </button>
                </form>
                {this.props.year > 1753 &&
                    <button
                        id="previous"
                        onClick={this.shiftByOne}
                    >
                        <FontAwesomeIcon icon={faCaretLeft} className="caret-left" />
                        {this.props.year - 1}
                    </button>
                }
                {this.props.year < 99999 &&
                    <button
                        id="next"
                        onClick={this.shiftByOne}
                    >
                        {this.props.year + 1}
                        <FontAwesomeIcon icon={faCaretRight} className="caret-right" />
                    </button>
                }
            </div>
        );
    }
};
