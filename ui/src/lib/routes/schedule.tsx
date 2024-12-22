import {useEffect, useState} from "react";
import {ExerciseWeights, Schedule, ScheduleExercise} from "../components/api/generated";
import {AxiosPromise, AxiosResponse} from "axios";
import {exerciseWeightsAPI, scheduleExercisesAPI, schedulesAPI} from "../components/api/api.ts";
import {addDays, format} from "date-fns";
import {Card, CardContent, CardHeader, CardTitle} from "../components/Card.tsx";

interface IExerciseInfo {
    sets: number | undefined,
    repetitions: number | undefined,
    exerciseName: string | undefined,
    weight: ExerciseWeights[]
}

interface IDisplaySchedule extends Schedule {
    exercises: IExerciseInfo[]
}

interface IExerciseNameWeights {
    exerciseName: ExerciseWeights
}

export default function SchedulePage() {
    const [schedules, setSchedules] = useState<IDisplaySchedule[]>([]);
    const schedules$: AxiosPromise<Schedule[]> = schedulesAPI.schedulesList();
    const scheduleExercises$: AxiosPromise<ScheduleExercise[]> = scheduleExercisesAPI.scheduleExercisesList();
    const exerciseWeights$: AxiosPromise<ExerciseWeights[]> = exerciseWeightsAPI.exerciseWeightsList();


    function getScheduleIdExerciseMap(scheduleExercises: ScheduleExercise[], exerciseWeights: ExerciseWeights[]): Map<string, > {
        const scheduleIdExerciseMap: Map<string, IExerciseInfo[]> = new Map();
        const exerciseWeightMap: Map<string, number> = getExerciseWeightMap(exerciseWeights);
        scheduleExercises.forEach((scheduleExercise: ScheduleExercise) => {
            let exercises: IExerciseInfo[] = [];
            if (scheduleIdExerciseMap.has(scheduleExercise.schedule_name!)) {
                exercises = scheduleIdExerciseMap.get(scheduleExercise.schedule_name!)!;
            }
            exercises.push({
                sets: scheduleExercise.num_sets,
                repetitions: scheduleExercise.num_repetitions,
                exerciseName: scheduleExercise.exercise_name,
                weight: exerciseWeightMap.get(scheduleExercise.schedule_name!)!
            });
            scheduleIdExerciseMap.set(scheduleExercise.schedule_name!, exercises);
        });
        return scheduleIdExerciseMap
    }

    /**
     * Maps the weight for each exercise/schedule
     * by the schedule name
     *
     * Map of schedule name -> map {
     *     exercise name -> weight
     * }
     */
    function getExerciseWeightMap(exerciseWeights: ExerciseWeights[]): Map<string, IExerciseNameWeights> {
        const exerciseWeightMap: Map<string, number> = new Map();
        exerciseWeights.forEach((exerciseWeight: ExerciseWeights) => {
            let weight: number = 0;
            if (exerciseWeightMap.has(exerciseWeight.schedule_name!)) {
                weight = exerciseWeightMap.get(exerciseWeight.schedule_name!)!;
            }
            exerciseWeightMap.set(exerciseWeight.schedule_name!, weight);
        });
        return exerciseWeightMap;
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
    const displaySchedules: IDisplaySchedule[] = [];

    function loadData() {
        Promise.all([
            schedules$,
            scheduleExercises$,
            exerciseWeights$
        ]).then((results: AxiosResponse[]) => {
            const s: Schedule[] = results[0].data;
            const se: ScheduleExercise[] = results[1].data;
            const ex: ExerciseWeights[] = results[2].data;

            let scheduleIdExerciseMap: Map<string, IExerciseInfo[]> = getScheduleIdExerciseMap(se, ex);

            /**
             * Iterate schedules and add exercises corresponding to each scheduleId.
             * This is done because the original model doesn't have exercises
             */
            s.forEach((schedule: Schedule) => {
                const displaySchedule: IDisplaySchedule = {
                    ...schedule,
                    exercises: scheduleIdExerciseMap.get(schedule.schedule_name)!,
                };
                displaySchedules.push(displaySchedule);
            });
            setSchedules(displaySchedules);
            console.log("Loaded data");
        }).catch(console.error);
    }

    function getDateHeader(dayOfWeek: number): string {
        return format(daysOfCurrentWeek[dayOfWeek], "EEEE, MMM dd");
    }

    useEffect(loadData, []);

    return (
        <>
            <h1>Schedule</h1>
            <main className="max-w-md md:max-w-2xl">
                {schedules.map((schedule: IDisplaySchedule, index: number) => (
                    <Card key={index} className="mt-3">
                        <CardHeader>
                            <CardTitle>
                                <div className="flex justify-between">
                                    <h4 className="text-lg font-medium" key={schedule.day_of_week}>
                                        Workout {schedule.schedule_name}
                                    </h4>
                                    <h4 className="text-lg font-medium">
                                        {getDateHeader(schedule.day_of_week)}
                                    </h4>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {schedule.exercises.length > 0 ? (
                                <table className="w-full">
                                    <thead>
                                    <tr>
                                        <th className={"text-left"}>Exercise</th>
                                        <th className={"text-left"}>Weight</th>
                                        <th className={"text-left"}>Sets</th>
                                        <th className={"text-left"}>Repetitions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        schedule.exercises.map((exercise: IExerciseInfo, index: number) => (
                                            <tr key={index}>
                                                <td width="60%">{exercise.exerciseName}</td>
                                                <td width="10%">{exercise.weight}</td>
                                                <td width="20%">{exercise.sets}</td>
                                                <td width="10%">{exercise.repetitions}</td>
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                </table>
                            ) : 'No exercises found.'}
                        </CardContent>
                    </Card>
                ))}
            </main>
        </>
    )
}