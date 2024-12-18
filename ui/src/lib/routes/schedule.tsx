import Calendar from 'react-calendar';
import {useState} from "react";
import {isSameDay} from "date-fns";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

function onChange() {

}

export default function SchedulePage() {
    const [value, onChange] = useState<Value>(new Date());
    const datesToAddClassTo: any[] = [];

    function tileClassName({date, view}): string | undefined {
        // Add class to tiles in month view only
        if (view === 'month') {
            // Check if a date React-Calendar wants to check is on the list of dates to add class to
            if (datesToAddClassTo.find(dDate => isSameDay(dDate, date))) {
                return 'myClassName';
            }
        }
    }

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