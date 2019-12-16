import { getWeekDayIndex,
    populateMonth,
    isLeapYear,
    populateYear,
    getStartingDay
} from '../util/months';

describe('getWeekDayIndex', () => {
    it('returns how many days are between Sunday (the first day of the week) and the given day', () => {
        const result = getWeekDayIndex('Thursday');
        expect(result).toBe(4);
    });
});

describe('populateMonth', () => {
    it('returns a month, which is an array of arrays of days that line up with the correct day of the week (where Sunday is the first day of the week), given the number of the days in the month and the day of the week on which the month starts', () => {
        const tuesdayResult = populateMonth(31, 'Tuesday');
        expect(tuesdayResult).toEqual([
            ['', '', 1, 2, 3, 4, 5],
            [6, 7, 8, 9, 10, 11, 12],
            [13, 14, 15, 16, 17, 18, 19],
            [20, 21, 22, 23, 24, 25, 26],
            [27, 28, 29, 30, 31, '', '']
        ]);

        const sundayResult = populateMonth(30, 'Sunday');
        expect(sundayResult).toEqual([
            [1, 2, 3, 4, 5, 6, 7],
            [8, 9, 10, 11, 12, 13, 14],
            [15, 16, 17, 18, 19, 20, 21],
            [22, 23, 24, 25, 26, 27, 28],
            [29, 30, '', '', '', '', '']
        ]);

        const fridayResult = populateMonth(31, 'Friday');
        expect(fridayResult).toEqual([
            ['', '', '', '', '', 1, 2],
            [3, 4, 5, 6, 7, 8, 9],
            [10, 11, 12, 13, 14, 15, 16],
            [17, 18, 19, 20, 21, 22, 23],
            [24, 25, 26, 27, 28, 29, 30],
            [31, '', '', '', '', '', '']
        ]);
    });
});

describe('isLeapYear', () => {
    it('returns true if the given year is a leap year', () => {
        const result1 = isLeapYear(2036);
        expect(result1).toBe(true);

        const result2 = isLeapYear(2000);
        expect(result2).toBe(true);

        const result3 = isLeapYear(1852);
        expect(result3).toBe(true);
    });

    it('returns false if the given year is not a leap year', () => {
        const result1 = isLeapYear(2100);
        expect(result1).toBe(false);

        const result2 = isLeapYear(2022);
        expect(result2).toBe(false);

        const result3 = isLeapYear(2014);
        expect(result3).toBe(false);
    });
});

describe('populateYear', () => {
    it('given a year, returns an array of months, a month being an array of arrays of days that line up with the correct day of the week (where Sunday is the first day of the week)', () => {
        const twentyNineteenResult = populateYear(2019);
        expect(twentyNineteenResult).toMatchSnapshot();

        const twentyTwentyResult = populateYear(2020);
        expect(twentyTwentyResult).toMatchSnapshot();

        const twentyTwentyOneResult = populateYear(2021);
        expect(twentyTwentyOneResult).toMatchSnapshot();

        const twentyTwentyFourResult = populateYear(2024);
        expect(twentyTwentyFourResult).toMatchSnapshot();
    });
});

describe('getStartingDay', () => {
    it('returns the day of the week on which the given year starts', () => {
        const result1 = getStartingDay(1753);
        expect(result1).toBe('Monday');

        const result2 = getStartingDay(1799);
        expect(result2).toBe('Tuesday');

        const result3 = getStartingDay(1800);
        expect(result3).toBe('Wednesday');

        const result4 = getStartingDay(1801);
        expect(result4).toBe('Thursday');

        const result5 = getStartingDay(1920);
        expect(result5).toBe('Thursday');

        const result6 = getStartingDay(1999);
        expect(result6).toBe('Friday');

        const result7 = getStartingDay(2000);
        expect(result7).toBe('Saturday');

        const result8 = getStartingDay(2001);
        expect(result8).toBe('Monday');

        const result9 = getStartingDay(2012);
        expect(result9).toBe('Sunday');

        const result10 = getStartingDay(2019);
        expect(result10).toBe('Tuesday');

        const result11 = getStartingDay(2020);
        expect(result11).toBe('Wednesday');

        const result12 = getStartingDay(2021);
        expect(result12).toBe('Friday');

        const result13 = getStartingDay(2120);
        expect(result13).toBe('Monday');

        const result14 = getStartingDay(2299);
        expect(result14).toBe('Sunday');

        const result15 = getStartingDay(2400);
        expect(result15).toBe('Saturday');

        const result16 = getStartingDay(2401);
        expect(result16).toBe('Monday');

        const result17 = getStartingDay(2600);
        expect(result17).toBe('Wednesday');

        const result18 = getStartingDay(3959);
        expect(result18).toBe('Thursday');
    });
});
