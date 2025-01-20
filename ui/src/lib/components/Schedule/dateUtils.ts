import {addDays, addWeeks, format, isValid, parse} from "date-fns";
import {Schedule} from "../api/generated";
import {enUS} from 'date-fns/locale';

export function isValidDate(dateString: string): boolean {
    const parsedDate = parse(dateString, 'P', new Date(), {locale: enUS});
    return isValid(parsedDate);
}

export function getDateHeader(dayOfWeek: number, daysOfNextScheduledSessions: Date[]): string {
    return format(getDateFromDayOfWeek(dayOfWeek, daysOfNextScheduledSessions), "EEEE, MMM dd");
}

export function getDateFromDayOfWeek(dayOfWeek: number, daysOfNextScheduledSessions: Date[]): Date {
    return daysOfNextScheduledSessions[dayOfWeek];
}

export function getFirstDayOfWeek(): Date {
    const curDate: Date = new Date();
    const first: number = curDate.getDate() - curDate.getDay();
    return new Date(curDate.setDate(first));
}

export function getNextScheduledWeek(shouldAddWeek: boolean = false): Date[] {
    let firstDayOfWeek: Date = getFirstDayOfWeek();

    if (shouldAddWeek) {
        firstDayOfWeek = addWeeks(firstDayOfWeek, 1);
    }

    const days: Date[] = [];
    for (let j = 0; j < 7; j++) {
        days.push(addDays(firstDayOfWeek, j));
    }

    return days;
}

export function getDaysOfWeekFromSchedules(schedules: Schedule[]): number[] {
    const days: number[] = [];
    schedules.forEach((schedule: Schedule) => {
        days.push(schedule.day_of_week);
    });
    return days.sort((a: number, b: number): number => a - b);
}

export function getDayNumberFromDayName(dayName: string): number {
    const dayMap: Map<string, number> = new Map();
    dayMap.set("Sunday", 0);
    dayMap.set("Monday", 1);
    dayMap.set("Tuesday", 2);
    dayMap.set("Wednesday", 3);
    dayMap.set("Thursday", 4);
    dayMap.set("Friday", 5);
    dayMap.set("Saturday", 6);
    const dayNumber: number | undefined = dayMap.get(dayName);
    if (!dayNumber) {
        throw new Error("Invalid day name: " + dayName);
    }
    return dayNumber;
}

export function isTodayAfterLastScheduledDay(schedules: Schedule[]): boolean {
    const todayNumber: number = getDayNumberFromDayName(format(new Date(), "EEEE"));
    const days: number[] = getDaysOfWeekFromSchedules(schedules);
    const lastDayOfSchedule: number = days[days.length - 1];
    return todayNumber > lastDayOfSchedule;
}
