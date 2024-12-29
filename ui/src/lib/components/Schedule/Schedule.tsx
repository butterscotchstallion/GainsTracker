import {ReactElement, useEffect, useState} from "react";
import {ExerciseWeights, Schedule, ScheduleExercise, Session} from "../api/generated";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "../Card.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendarDay, faGear, faSquarePlus} from "@fortawesome/free-solid-svg-icons";
import Button from "../Button.tsx";
import {AxiosPromise, AxiosResponse} from "axios";
import {exerciseWeightsAPI, scheduleExercisesAPI, schedulesAPI, sessionsAPI} from "../api/api.ts";
import {useToast} from "../useToast.ts";
import {addDays, addWeeks, format, isPast} from "date-fns";
import CounterButton from "../CounterButton/CounterButton.tsx";
import {ToastAction} from "@radix-ui/react-toast";
import {SessionData} from "react-router";
import "./schedule.scss";

interface IExerciseInfo {
    sets: number | undefined,
    repetitions: number | undefined,
    exerciseName: string | undefined,
    weight: number
}

interface IDisplaySchedule extends Schedule {
    exercises: IExerciseInfo[]
}

interface IExerciseInfo {
    sets: number | undefined,
    repetitions: number | undefined,
    exerciseName: string | undefined,
    weight: number
}

interface IDisplaySchedule extends Schedule {
    exercises: IExerciseInfo[]
}

export default function ScheduleComponent(): ReactElement {
    const [isSessionStarted, setIsSessionStarted] = useState<boolean>(false);
    const [schedules, setSchedules] = useState<IDisplaySchedule[]>([]);
    // Stores exerciseName -> reps/sets/weight
    const [exerciseNameDetailsMap, setExerciseNameDetailsMap] = useState<Map<string, IExerciseInfo>>();
    // Start/end used for session data
    const [sessionStartTime, setSessionStartTime] = useState<Date>();
    const [sessionEndTime, setSessionEndTime] = useState<Date>();
    const [programId, setProgramId] = useState<number>();
    const schedules$: AxiosPromise<Schedule[]> = schedulesAPI.schedulesList();
    const scheduleExercises$: AxiosPromise<ScheduleExercise[]> = scheduleExercisesAPI.scheduleExercisesList();
    const exerciseWeights$: AxiosPromise<ExerciseWeights[]> = exerciseWeightsAPI.exerciseWeightsList();
    const sessionDataMap: Map<string, IExerciseInfo> = new Map();
    const {toast} = useToast()

    /**
     * Each schedule can have different exercises with different weights for each exercise
     * @param scheduleExercises
     * @param exerciseWeights
     */
    function getScheduleIdExerciseMap(scheduleExercises: ScheduleExercise[], exerciseWeights: ExerciseWeights[]): Map<string, Map<string, IExerciseInfo[]>> {
        const scheduleIdExerciseMap: Map<string, Map<string, IExerciseInfo[]>> = new Map();
        const exerciseWeightMap: Map<string, Map<string, number>> = getExerciseWeightMap(exerciseWeights);
        scheduleExercises.forEach((scheduleExercise: ScheduleExercise) => {
            let exercises: IExerciseInfo[] = [];
            if (scheduleIdExerciseMap.has(scheduleExercise.schedule_name)) {
                exercises = scheduleIdExerciseMap.get(scheduleExercise.schedule_name);
            }
            const scheduleMap: Map<string, number> = exerciseWeightMap.get(scheduleExercise.schedule_name);
            exercises.push({
                sets: scheduleExercise.num_sets,
                repetitions: scheduleExercise.num_repetitions,
                exerciseName: scheduleExercise.exercise_name,
                weight: scheduleMap.get(scheduleExercise.exercise_name)
            });
            scheduleIdExerciseMap.set(scheduleExercise.schedule_name, exercises);
        });
        return scheduleIdExerciseMap;
    }

    /**
     * Maps the weight for each exercise/schedule
     * by the schedule name
     *
     * Map of schedule name -> map {
     *     exercise name -> weight
     * }
     */
    function getExerciseWeightMap(exerciseWeights: ExerciseWeights[]): Map<string, Map<string, number>> {
        const scheduleExerciseWeightMap: Map<string, Map<string, number>> = new Map();
        exerciseWeights.forEach((exerciseWeight: ExerciseWeights) => {
            // Initialize each schedule
            if (!scheduleExerciseWeightMap.has(exerciseWeight.schedule_name)) {
                scheduleExerciseWeightMap.set(exerciseWeight.schedule_name, new Map());
            }
            const exerciseWeightMap: Map<string, number> = scheduleExerciseWeightMap.get(exerciseWeight.schedule_name);
            exerciseWeightMap.set(exerciseWeight.exercise_name, exerciseWeight.weight);
            scheduleExerciseWeightMap.set(exerciseWeight.schedule_name, exerciseWeightMap);
        });
        return scheduleExerciseWeightMap;
    }

    function getFirstDayOfWeek(): Date {
        const curDate: Date = new Date();
        const first: number = curDate.getDate() - curDate.getDay();
        return new Date(curDate.setDate(first));
    }

    function getNextScheduledWeek(shouldAddWeek: boolean = false): Date[] {
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

    function getDaysOfWeekFromSchedules(schedules: Schedule[]): number[] {
        const days: number[] = [];
        schedules.forEach((schedule: Schedule) => {
            days.push(schedule.day_of_week);
        });
        return days.sort((a: number, b: number): number => a - b);
    }

    function getDayNumberFromDayName(dayName: string): number {
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

    function isTodayAfterLastScheduledDay(schedules: Schedule[]): boolean {
        const todayNumber: number = getDayNumberFromDayName(format(new Date(), "EEEE"));
        const days: number[] = getDaysOfWeekFromSchedules(schedules);
        const lastDayOfSchedule: number = days[days.length - 1];
        return todayNumber > lastDayOfSchedule;
    }

    function getDayNumberDateMap(schedules: Schedule[]): Map<number, string> {
        const dayNumberDateMap: Map<number, string> = new Map();
        schedules.forEach((schedule: Schedule) => {
            dayNumberDateMap.set(schedule.day_of_week, format(getDateFromDayOfWeek(schedule.day_of_week), "EEEE, MMM dd"));
        });
        return dayNumberDateMap;
    }

    let daysOfNextScheduledSessions: Date[] = getNextScheduledWeek();
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
            const isTodayAfterLastDay: boolean = isTodayAfterLastScheduledDay(s);

            if (isTodayAfterLastDay) {
                daysOfNextScheduledSessions = getNextScheduledWeek(true);
                console.log("Adding a week: ", daysOfNextScheduledSessions);
            }

            // programId should be the same for all exercises
            setProgramId(parseInt(s[0].program_id, 10));

            let scheduleIdExerciseMap: Map<string, Map<string, IExerciseInfo[]>> = getScheduleIdExerciseMap(se, ex);

            /**
             * Iterate schedules and add exercises corresponding to each scheduleId.
             * This is done because the original model doesn't have exercises
             */
            s.forEach((schedule: Schedule) => {
                const scheduleDate: Date = daysOfNextScheduledSessions[schedule.day_of_week];
                // Set time to 2200 because at this point we're probably not doing more work-outs
                scheduleDate.setHours(22, 0, 0, 0);
                const isScheduledDayInPast = isPast(scheduleDate);
                if (!isScheduledDayInPast) {
                    const displaySchedule: IDisplaySchedule = {
                        ...schedule,
                        exercises: scheduleIdExerciseMap.get(schedule.schedule_name)!,
                    };
                    displaySchedules.push(displaySchedule);
                }
            });
            setSchedules(displaySchedules);
            console.info("Loaded data");
        }).catch(console.error);
    }

    function getDateHeader(dayOfWeek: number): string {
        return format(getDateFromDayOfWeek(dayOfWeek), "EEEE, MMM dd");
    }

    function getDateFromDayOfWeek(dayOfWeek: number): Date {
        return daysOfNextScheduledSessions[dayOfWeek];
    }

    function updateSessionData(scheduleExercise: IExerciseInfo): void {
        sessionDataMap.set(scheduleExercise.exerciseName, scheduleExercise);
        setExerciseNameDetailsMap(sessionDataMap);
        setIsSessionStarted(true);
        if (!sessionStartTime) {
            setSessionEndTime(new Date());
        }
        console.log("Updated session data: ", sessionDataMap.get(scheduleExercise.exerciseName));
    }

    function getCounterButtonsForSets(scheduleExercise: IExerciseInfo): ReactElement {
        return (
            <ul className="list-none counter-button-list flex justify-between">
                {[...Array(scheduleExercise.sets).keys()].map((index: number) => (
                    <li key={index}>
                        <CounterButton onClickCallback={() => updateSessionData(scheduleExercise)}
                                       className="mr-3"
                                       limit={scheduleExercise.repetitions}
                                       readOnly={false}/>
                    </li>
                ))}
            </ul>
        )
    }

    /**
     * Save sessionData
     * 1. Save program, start_timestamp, end_timestamp
     * 2. Insert row into session_exercise containing set/reps/weight info
     * for each exercise
     */
    function onSessionFinish() {
        setSessionEndTime(new Date());
        saveSessionData().then((response: AxiosResponse<Session, any>) => {
            console.info("Session info saved: " + response);

            // Add exercise data here
        }).catch((error) => {
            toast({
                title: "Error saving session",
                description: "There was a problem: " + error,
                action: <ToastAction altText="">OK</ToastAction>,
            });
        });
    }

    /**
     * Saves program, start time, end time.
     * Resulting session id is used to save the sessionExercise data
     */
    function saveSessionData(): AxiosPromise<Session> {
        console.log(`Saving session data: start=${sessionStartTime}, end=${sessionEndTime}, programId=${programId}`);
        const sessionData: SessionData = {
            start_timestamp: sessionStartTime,
            end_timestamp: sessionEndTime,
            program_id: programId,
        };
        return sessionsAPI.sessionsCreate(sessionData);
    }

    useEffect(loadData, []);

    return (
        <>
            {schedules.map((schedule: IDisplaySchedule, index: number) => (
                <Card key={index} className="mt-3">
                    <CardHeader>
                        <CardTitle>
                            <div className="flex justify-between">
                                <h4 className="text-lg font-medium" key={schedule.day_of_week}>
                                    Workout {schedule.schedule_name}
                                </h4>
                                <h4 className="text-lg font-medium">
                                    <FontAwesomeIcon
                                        icon={faCalendarDay}/>&nbsp; {getDateHeader(schedule.day_of_week)}
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
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    schedule.exercises.map((exercise: IExerciseInfo, index: number) => (
                                        <tr key={index}>
                                            <td width="30%">{exercise.exerciseName}</td>
                                            <td width="15%">
                                                <FontAwesomeIcon icon={faGear}/>&nbsp; {exercise.weight}
                                            </td>
                                            <td width="40%" className="pb-4">
                                                {getCounterButtonsForSets(exercise)}
                                            </td>
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </table>
                        ) : 'No exercises found.'}
                    </CardContent>
                    {isSessionStarted ? (
                        <>
                            <CardFooter>
                                <div className="flex items-center justify-between w-full">
                                    <div>
                                        {
                                            // timer here
                                            isSessionStarted ? (
                                                <>

                                                </>
                                            ) : ''
                                        }
                                    </div>

                                    <div className="flex items-center">
                                        <>
                                            <Button onClick={onSessionFinish}>
                                                <FontAwesomeIcon icon={faSquarePlus}/>
                                                &nbsp; Finish Session
                                            </Button>
                                        </>
                                    </div>
                                </div>
                            </CardFooter>
                        </>
                    ) : ''}
                </Card>
            ))}
        </>
    );
};