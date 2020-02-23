import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';

export const YearSwitcher = React.forwardRef((
    { year, yearInputValue, handleYearInputChange, dispatchYear, handleSubmit },
    ref
) => (
    <div className="y-margin-15">
        <form
            ref={ref}
            onSubmit={handleSubmit}
            className="bottom-margin-17"
        >
            <label htmlFor="year-input">Year: </label>
            <input
                type="text"
                id="year-input"
                name="year"
                className="right-margin-20 left-padding-3"
                required
                pattern="^([1-9][7-9][5-9][3-9]|[1-9][7-9][6-9]\d|[1-9][8-9]\d{2}|[2-9]\d{3}|[1-9]\d{4})$"
                title="Please enter a valid year between 1753 and 99999, inclusive."
                value={yearInputValue}
                onChange={handleYearInputChange}
            />
            <button type="submit">Submit</button>
        </form>
        {year > 1753 &&
            <button onClick={() => dispatchYear({ type: 'subtractOne' })}>
                <FontAwesomeIcon icon={faCaretLeft} className="caret-left" />
                {year - 1}
            </button>
        }
        {year < 99999 &&
            <button onClick={() => dispatchYear({ type: 'addOne' })}>
                {year + 1}
                <FontAwesomeIcon icon={faCaretRight} className="caret-right" />
            </button>
        }
    </div>
));
