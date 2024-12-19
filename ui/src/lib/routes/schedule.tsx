import {useEffect, useState} from "react";
import {Schedule} from "../components/api/generated";
import {AxiosPromise, AxiosResponse} from "axios";
import {schedulesAPI} from "../components/api/api.ts";
import {addDays, format} from "date-fns";

export default function SchedulePage() {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const schedules$: AxiosPromise<Schedule[]> = schedulesAPI.schedulesList();

    function getFirstDayOfWeek(): Date {
        const curDate = new Date();
        const first: number = curDate.getDate() - curDate.getDay();
        return new Date(curDate.setDate(first));
    }

    function getDaysOfCurrentWeek(): Date[] {
        const firstDayOfWeek: Date = getFirstDayOfWeek();
        const days: Date[] = [];
        for (let j: number = 0; j < 7; j++) {
            days.push(addDays(firstDayOfWeek, j));
        }
        return days;
    }

    const daysOfCurrentWeek: Date[] = getDaysOfCurrentWeek();

    useEffect(() => {
        schedules$.then((response: AxiosResponse<Schedule[]>) => {
            setSchedules(response.data);
        });
    })

    function getDateHeader(dayOfWeek: number): string {
        return format(daysOfCurrentWeek[dayOfWeek], "EEEE, MMM dd yyyy");
    }

    return (
        <>
            <h1>Schedule</h1>
            <div className="max-w-xl">
                {schedules.map((schedule: Schedule) => (
                    <h4 className={"text-lg font-bold"}
                        key={schedule.day_of_week}>{getDateHeader(schedule.day_of_week)}</h4>
                ))}
            </div>
        </>
    )
}