export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAYS_IN_A_WEEK = 7;
const YEAR_TWO_THOUSAND = [2000, 'Saturday'];

export const getWeekDayIndex = dayOfTheWeek => DAYS.indexOf(dayOfTheWeek);

const getWeekIndex = (dayIndex, lengthOfFirstWeek) => {
    const numberOfWeeksSoFar = Math.floor(dayIndex / DAYS_IN_A_WEEK);
    return (dayIndex % DAYS_IN_A_WEEK >= lengthOfFirstWeek)
        ? numberOfWeeksSoFar + 1
        : numberOfWeeksSoFar;
};

export const populateMonth = (daysInMonth, startingDay) => {
    const weekDayIndexOfFirstDay = getWeekDayIndex(startingDay);
    const lengthOfFirstWeek = DAYS_IN_A_WEEK - weekDayIndexOfFirstDay;
    const numberOfWeeks = getWeekIndex(daysInMonth - 1, lengthOfFirstWeek) + 1;

    const monthArray = [...Array(numberOfWeeks)].map(() => Array(DAYS_IN_A_WEEK).fill(''));

    for (let i = 0; i < daysInMonth; i++) {
        const weekDayIndex = (weekDayIndexOfFirstDay + i % DAYS_IN_A_WEEK) % DAYS_IN_A_WEEK;
        const weekIndex = getWeekIndex(i, lengthOfFirstWeek);
        monthArray[weekIndex][weekDayIndex] = i + 1;
    }

    return monthArray;
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
            const lastWeekOfPreviousMonth = previousMonth[previousMonth.length - 1];
            const lastWeekOfPreviousMonthWithoutEmptyStrings = lastWeekOfPreviousMonth.filter(day => day);
            const lengthOfLastWeekOfPreviousMonth = lastWeekOfPreviousMonthWithoutEmptyStrings.length;
            const firstDayOfThisMonth = DAYS[lengthOfLastWeekOfPreviousMonth % DAYS.length];
            newMonthsArray.push(populateMonth(month, firstDayOfThisMonth));
            return newMonthsArray;
        }
    }, []);
}

export const monthIndexMap = new Map([
   [1, 'jan'], [2, 'feb'], [3, 'mar'], [4, 'apr'], [5, 'may'], [6, 'jun'], [7, 'jul'], [8, 'aug'], [9, 'sep'], [10, 'oct'], [11, 'nov'], [12, 'dec']
]);
