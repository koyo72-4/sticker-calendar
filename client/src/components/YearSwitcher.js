import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';

export const YearSwitcher = React.forwardRef((
    { year, yearInputValue, handleYearInputChange, subtractOne, addOne, handleSubmit, handleKeyPress },
    ref
) => (
    <div className="y-margin-15">
        <form
            ref={ref}
            className="bottom-margin-17"
        >
            <label htmlFor="year-input">Year: </label>
            <input
                type="text"
                id="year-input"
                name="year"
                className="right-margin-20 left-padding-3"
                required
                pattern="^([1-9][7-9][5-9][3-9]|[1-9][8-9][0-9]{2}|[2-9][0-9]{3}|[1-9]\d{4})$"
                title="Please enter a valid year between 1753 and 99999, inclusive."
                value={yearInputValue}
                onChange={handleYearInputChange}
                onKeyPress={handleKeyPress}
            />
            <button
                type="submit"
                onClick={handleSubmit}
            >
                Submit
            </button>
        </form>
        {year > 1753 &&
            <button onClick={subtractOne}>
                <FontAwesomeIcon icon={faCaretLeft} className="caret-left" />
                {year - 1}
            </button>
        }
        {year < 99999 &&
            <button onClick={addOne}>
                {year + 1}
                <FontAwesomeIcon icon={faCaretRight} className="caret-right" />
            </button>
        }
    </div>
));
