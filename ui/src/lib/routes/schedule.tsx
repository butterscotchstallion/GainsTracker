import Calendar from 'react-calendar';
import {useEffect, useState} from "react";
import {isSameDay} from "date-fns";
import {Schedule} from "../components/api/generated";
import {AxiosPromise, AxiosResponse} from "axios";
import {schedulesAPI} from "../components/api/api.ts";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

function onChange() {

}

export default function SchedulePage() {
    const [value, onChange] = useState<Value>(new Date());
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const datesToAddClassTo: any[] = [];

    function tileClassName({date, view}): string | undefined {
        // Add class to tiles in month view only
        if (view === 'month') {
            // Check if a date React-Calendar wants to check is on the list of dates to add class to
            if (datesToAddClassTo.find(dDate => isSameDay(dDate, date))) {
                return 'bg-slate-500';
            }
        }
    }

    const schedules$: AxiosPromise<Schedule[]> = schedulesAPI.schedulesList();
    useEffect(() => {
        schedules$.then((response: AxiosResponse<Schedule[]>) => {
            setSchedules(response.data);
        });
    })

    return (
        <>
            <h1>Schedule</h1>
            <div className="max-w-xl">
                <Calendar
                    onChange={onChange}
                    tileClassName={tileClassName}
                    value={value}/>
            </div>
        </>
    )
}