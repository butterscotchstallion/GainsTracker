import {useEffect, useState} from "react";
import {Schedule} from "../components/api/generated";
import {AxiosPromise, AxiosResponse} from "axios";
import {schedulesAPI} from "../components/api/api.ts";
import {addDays, format} from "date-fns";
import {Card, CardContent, CardHeader, CardTitle} from "../components/Card.tsx";

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
        }).catch(console.error);
    }, [])

    function getDateHeader(dayOfWeek: number): string {
        return format(daysOfCurrentWeek[dayOfWeek], "EEEE, MMM dd");
    }

    return (
        <>
            <h1>Schedule</h1>
            <div>
                {schedules.map((schedule: Schedule, index: number) => (
                    <Card key={index} className="w-[450px] mt-3">
                        <CardHeader>
                            <CardTitle>
                                <h4 className={"text-lg"}
                                    key={schedule.day_of_week}>
                                    Workout {schedule.schedule_name} &mdash;&nbsp;
                                    {getDateHeader(schedule.day_of_week)}
                                </h4>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            Exercises go here.
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    )
}