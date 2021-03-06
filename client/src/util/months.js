export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
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

const getNumberOfLeapYearsFrom2000 = numberOfYearsFrom2000 => {
    let numLeapYears = Math.ceil(numberOfYearsFrom2000 / 4);
    if (numberOfYearsFrom2000 > -100 && numberOfYearsFrom2000 <= 100) {
        return numLeapYears;
    }
    const hundreds = numberOfYearsFrom2000 > 100 && numberOfYearsFrom2000 % 100 === 0
        ? Math.floor(numberOfYearsFrom2000 / 100 - 1)
        : Math.floor(Math.abs(numberOfYearsFrom2000) / 100);
    const fourHundreds = Math.floor(hundreds / 4);
    return numLeapYears + (hundreds - fourHundreds) * (numberOfYearsFrom2000 < 0 ? 1 : -1);
};

export const getStartingDay = (year) => {
    const [exampleYear, exampleStartingDay] = YEAR_TWO_THOUSAND;
    const exampleWeekDayIndex = getWeekDayIndex(exampleStartingDay);
    const numberOfYearsDifference = year - exampleYear;
    const numberOfLeapYears = getNumberOfLeapYearsFrom2000(numberOfYearsDifference);
    const offset = (numberOfYearsDifference + numberOfLeapYears) % 7;
    const weekDayIndex = (exampleWeekDayIndex + offset) % 7;
    return DAYS[weekDayIndex];
}

export const populateYear = (year) => {
    const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (isLeapYear(year)) {
        monthLengths[1] = 29;
    }

    return monthLengths.reduce((newMonthsArray, daysInMonth, index) => {
        let firstDayOfThisMonth;
        if (index === 0) {
            firstDayOfThisMonth = getStartingDay(year);
        } else {
            const previousMonth = newMonthsArray[index - 1];
            const lengthOfLastWeekOfPreviousMonth = previousMonth[previousMonth.length - 1].filter(day => day).length;
            firstDayOfThisMonth = DAYS[lengthOfLastWeekOfPreviousMonth % DAYS_IN_A_WEEK];
        }
        newMonthsArray.push(populateMonth(daysInMonth, firstDayOfThisMonth));
        return newMonthsArray;
    }, []);
}
