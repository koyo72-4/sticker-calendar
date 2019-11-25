const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const DAYS_IN_A_WEEK = 7;
const YEAR_TWO_THOUSAND = [2000, 'saturday'];

export const getOffset = dayOfTheWeek => DAYS.indexOf(dayOfTheWeek);

export const populateMonth = (numberOfDays, startingDay) => {
    const offset = getOffset(startingDay);

    const month = [];
    for (let i = 1; i < numberOfDays + 1; i += DAYS_IN_A_WEEK) {
        const week = [];
        if (i === 1 && startingDay !== 'sunday') {
            for (let x = 0; x < offset; x++) {
                week.push('');
            }
            for (let j = i; (j < i + (DAYS_IN_A_WEEK - offset)) && (j < numberOfDays + 1); j++) {
                week.push(j);
            }
            i -= offset;
        } else {
            for (let j = i; (j < i + DAYS_IN_A_WEEK) && (j < numberOfDays + 1); j++) {
                week.push(j);
            }
        }
        month.push(week);
    }
    return month;
}

export const isLeapYear = (year) => {
    if (year % 100 === 0) {
        return year % 400 === 0;
    }
    return year % 4 === 0;
}

export const getStartingDay = (year) => {
    const [exampleYear, exampleStartingDay] = YEAR_TWO_THOUSAND;
    const exampleIndex = DAYS.indexOf(exampleStartingDay);
    const difference = year - exampleYear;
    
    let numberOfLeapYears = Math.ceil(difference / 4);
    if (difference > 100) {
        const hundreds = difference % 100 === 0
            ? Math.floor(difference / 100) - 1
            : Math.floor(difference / 100);
        const fourHundreds = Math.floor(hundreds / 4);
        numberOfLeapYears -= (hundreds - fourHundreds);
    } else if (difference <= -100) {
        const positiveDifference = Math.abs(difference);
        const hundreds = Math.floor(positiveDifference / 100);
        const fourHundreds = Math.floor(hundreds / 4);
        numberOfLeapYears += (hundreds - fourHundreds);
    }

    const offset = (difference + numberOfLeapYears) % 7;

    let yearIndex;
    if ((offset < 0) && Math.abs(offset) > exampleIndex) {
        yearIndex = 7 + (exampleIndex + offset);
    } else {
        yearIndex = (exampleIndex + offset) % 7;
    }

    return DAYS[yearIndex];
}

export const populateYear = (year) => {
    const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (isLeapYear(year)) {
        monthLengths[1] = 29;
    }

    return monthLengths.reduce((newMonthsArray, month, index) => {
        if (index === 0) {
            const startingDay = getStartingDay(year);
            newMonthsArray.push(populateMonth(month, startingDay));
            return newMonthsArray;
        } else {
            const previousMonth = newMonthsArray[index - 1];
            const lengthOfLastWeekOfPreviousMonth = previousMonth[previousMonth.length - 1].length;
            const firstDayOfThisMonth = DAYS[lengthOfLastWeekOfPreviousMonth % DAYS.length];
            newMonthsArray.push(populateMonth(month, firstDayOfThisMonth));
            return newMonthsArray;
        }
    }, []);
}
