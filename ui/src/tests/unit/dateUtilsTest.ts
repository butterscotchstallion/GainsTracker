import {
    getDateFromDayOfWeek,
    getDateHeader,
    getDayNumberFromDayName,
    getDaysOfWeekFromSchedules,
    getFirstDayOfWeek,
    getNextScheduledWeek,
    isTodayAfterLastScheduledDay,
    isValidDate,
} from '../../lib/components/Schedule/dateUtils.ts';

describe('dateUtils', () => {
    describe('getDateHeader', () => {
        it('should return a properly formatted date header string', () => {
            let daysOfNextScheduledSessions: Date[] = getNextScheduledWeek();
            const result = getDateHeader(1, daysOfNextScheduledSessions);
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
            expect(isValidDate(result));
        });
    });

    describe('getDateFromDayOfWeek', () => {
        it('should return a date for the given day of the week based on the reference date', () => {
            const referenceDate = new Date('2023-10-01'); // Sunday
            const result = getDateFromDayOfWeek('Monday', referenceDate);
            expect(result).toBeInstanceOf(Date);
            expect(result.getDay()).toBe(1); // Monday should map to 1
        });

        it('should handle invalid day names gracefully', () => {
            const referenceDate = new Date('2023-10-01');
            const result = getDateFromDayOfWeek('InvalidDay', referenceDate);
            expect(result).toBeNull(); // Assuming function returns null on invalid day name
        });
    });

    describe('getFirstDayOfWeek', () => {
        it('should return the first day of the week for the given date', () => {
            const date = new Date('2023-10-04'); // Wednesday
            const result = getFirstDayOfWeek(date);
            expect(result).toBeInstanceOf(Date);
            expect(result.getDay()).toBe(0); // Expecting Sunday as the first day of the week
        });
    });

    describe('getNextScheduledWeek', () => {
        it('should return an array of scheduled dates for the next week', () => {
            const currentDate = new Date('2023-10-01');
            const schedules = ['Monday', 'Wednesday', 'Friday']; // Valid schedule
            const result = getNextScheduledWeek(currentDate, schedules);

            expect(Array.isArray(result)).toBeTruthy();
            expect(result.length).toBe(3); // Expect 3 dates for Monday, Wednesday, Friday
            result.forEach((date) => {
                expect(date).toBeInstanceOf(Date);
            });
        });

        it('should return an empty array if no days are scheduled', () => {
            const currentDate = new Date('2023-10-01');
            const schedules: string[] = [];
            const result = getNextScheduledWeek(currentDate, schedules);

            expect(Array.isArray(result)).toBeTruthy();
            expect(result.length).toBe(0);
        });
    });

    describe('getDaysOfWeekFromSchedules', () => {
        it('should extract valid day names from the given schedule objects', () => {
            const schedules = [
                {day: 'Monday'},
                {day: 'Wednesday'},
                {day: 'Friday'},
            ];
            const result = getDaysOfWeekFromSchedules(schedules);

            expect(Array.isArray(result)).toBeTruthy();
            expect(result).toEqual(['Monday', 'Wednesday', 'Friday']);
        });

        it('should return an empty array if schedules are empty', () => {
            const schedules: any[] = [];
            const result = getDaysOfWeekFromSchedules(schedules);

            expect(Array.isArray(result)).toBeTruthy();
            expect(result).toEqual([]);
        });
    });

    describe('getDayNumberFromDayName', () => {
        it('should return valid day numbers for correct day names', () => {
            expect(getDayNumberFromDayName('Monday')).toBe(1);
            expect(getDayNumberFromDayName('Sunday')).toBe(0);
            expect(getDayNumberFromDayName('Friday')).toBe(5);
        });

        it('should return -1 for invalid day names', () => {
            expect(getDayNumberFromDayName('Funday')).toBe(-1);
        });
    });

    describe('isTodayAfterLastScheduledDay', () => {
        it('should return true if today is after the last scheduled day', () => {
            const lastScheduledDay = new Date();
            lastScheduledDay.setDate(lastScheduledDay.getDate() - 1); // Yesterday
            const result = isTodayAfterLastScheduledDay(lastScheduledDay);
            expect(result).toBe(true);
        });

        it('should return false if today is on or before the last scheduled day', () => {
            const lastScheduledDay = new Date(); // Today
            expect(isTodayAfterLastScheduledDay(lastScheduledDay)).toBe(false);

            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 1); // Tomorrow
            expect(isTodayAfterLastScheduledDay(futureDate)).toBe(false);
        });

        it('should handle invalid inputs without throwing errors', () => {
            const result = isTodayAfterLastScheduledDay(null as any);
            expect(result).toBe(false); // Assuming function returns false for invalid input
        });
    });
});