import {useEffect, useState} from "react";
import {Schedule, ScheduleExercise} from "../components/api/generated";
import {AxiosPromise, AxiosResponse} from "axios";
import {scheduleExercisesAPI, schedulesAPI} from "../components/api/api.ts";
import {addDays, format} from "date-fns";
import {Card, CardContent, CardHeader, CardTitle} from "../components/Card.tsx";

interface IExerciseInfo {
    sets: number | undefined,
    repetitions: number | undefined,
    exercise_name: string | undefined
}

export default function SchedulePage() {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [exercises, setExercises] = useState<IExerciseInfo[]>([])
    const schedules$: AxiosPromise<Schedule[]> = schedulesAPI.schedulesList();
    const scheduleExercises$: AxiosPromise<ScheduleExercise[]> = scheduleExercisesAPI.scheduleExercisesList();
    let scheduleIdExerciseMap: Map<number, IExerciseInfo[]> = new Map();

    function getScheduleIdExerciseMap(scheduleExercises: ScheduleExercise[]): Map<number, IExerciseInfo[]> {
        const scheduleIdExerciseMap: Map<number, IExerciseInfo[]> = new Map();
        scheduleExercises.forEach((scheduleExercise: ScheduleExercise) => {
            if (scheduleExercise.schedule_id) {
                const scheduleId: number = parseInt(scheduleExercise.schedule_id, 10);
                let exercises: IExerciseInfo[] = [];
                if (scheduleIdExerciseMap.has(scheduleId)) {
                    exercises = scheduleIdExerciseMap.get(scheduleId)!;
                }
                exercises.push({
                    sets: scheduleExercise.num_sets,
                    repetitions: scheduleExercise.num_repetitions,
                    exercise_name: scheduleExercise.exercise_name
                });
                scheduleIdExerciseMap.set(scheduleId, exercises);
            } else {
                console.error("Schedule exercise has no schedule id?!");
            }
        });
        return scheduleIdExerciseMap
    }

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
        Promise.all([
            schedules$,
            scheduleExercises$
        ]).then((results: AxiosResponse[]) => {
            setSchedules(results[0].data);
            scheduleIdExerciseMap = getScheduleIdExerciseMap(results[1].data);
            /*
            const exc: IExerciseInfo[] = [];
            results[1].data.forEach((scheduleExercise: ScheduleExercise) => {
                const scheduleId: number = parseInt(scheduleExercise.schedule_id!, 10);
                const exerciseInfo: IExerciseInfo[] | undefined = scheduleIdExerciseMap.get(scheduleId)
                if (exerciseInfo) {
                    //exc.push(exerciseInfo)
                } else {
                    console.error("Exercise info not found for schedule id: " + scheduleId);
                }
            });
            //setExercises(exerciseInfo);*/
        }).catch(console.error);
    }, []);

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
                            {scheduleIdExerciseMap.get(schedule.id)!?.length > 0 ? (
                                scheduleIdExerciseMap.get(schedule.id)!?.map((exercise: IExerciseInfo) => (
                                    <p key={exercise.exercise_name}>{exercise.exercise_name}</p>
                                ))
                            ) : 'No exercises found.'}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    )
}