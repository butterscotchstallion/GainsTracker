import {ReactElement, useEffect, useState} from "react";
import {ExerciseWeights, Schedule, ScheduleExercise, Session} from "../api/generated";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "../Card.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendarDay, faGear, faSquarePlus} from "@fortawesome/free-solid-svg-icons";
import Button from "../Button.tsx";
import {AxiosPromise, AxiosResponse} from "axios";
import {exerciseWeightsAPI, scheduleExercisesAPI, schedulesAPI, sessionsAPI} from "../api/api.ts";
import {useToast} from "../useToast.ts";
import {isPast} from "date-fns";
import CounterButton, {CounterButtonState, getButtonState} from "../CounterButton/CounterButton.tsx";
import {ToastAction} from "@radix-ui/react-toast";

import "./schedule.scss";
import {getDateHeader, getNextScheduledWeek, isScheduleDayToday, isTodayAfterLastScheduledDay} from "./dateUtils.ts";

interface IExerciseInfo {
    sets: number | undefined,
    repetitions: number | undefined,
    exerciseName: string | undefined,
    weight: number
}

interface IDisplaySchedule extends Schedule {
    exercises: IExerciseInfo[],
    dateHeader: string,
    isToday: boolean,
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

const DEBUG_MODE: boolean = true;

export default function ScheduleComponent(): ReactElement {
    const [isSessionStarted, setIsSessionStarted] = useState<boolean>(false);
    const [schedules, setSchedules] = useState<IDisplaySchedule[]>([]);
    // Stores exerciseName -> reps/sets/weight
    const [exerciseNameDetailsMap, setExerciseNameDetailsMap] = useState<Map<string, IExerciseInfo>>();
    // Start/end used for session data
    const [sessionStartTime, setSessionStartTime] = useState<Date>();
    const [sessionEndTime, setSessionEndTime] = useState<Date>();
    // State map of exerciseName -> CounterButtonState
    const [buttonStateMap, setButtonStateMap] = useState<Map<string, CounterButtonState>[]>([]);
    const [programId, setProgramId] = useState<number>();
    const schedules$: AxiosPromise<Schedule[]> = schedulesAPI.schedulesList();
    const scheduleExercises$: AxiosPromise<ScheduleExercise[]> = scheduleExercisesAPI.scheduleExercisesList();
    const exerciseWeights$: AxiosPromise<ExerciseWeights[]> = exerciseWeightsAPI.exerciseWeightsList();
    const sessionData: Map<string, IExerciseInfo>[] = [];
    const {toast} = useToast();

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
            let scheduleIdExerciseMap: Map<string, Map<string, IExerciseInfo[]>> = getScheduleIdExerciseMap(se, ex);
            // programId should be the same for all exercises
            setProgramId(parseInt(s[0].program_id, 10));

            if (isTodayAfterLastDay) {
                daysOfNextScheduledSessions = getNextScheduledWeek(true);
                console.log("Adding a week: ", daysOfNextScheduledSessions);
            }

            /**
             * Iterate schedules and add exercises corresponding to each scheduleId.
             * This is done because the original model doesn't have exercises
             */
            s.forEach((schedule: Schedule) => {
                const scheduleDate: Date = daysOfNextScheduledSessions[schedule.day_of_week];
                scheduleDate.setHours(23, 0, 0, 0);
                const isScheduledDayInPast: boolean = isPast(scheduleDate);
                if (!isScheduledDayInPast) {
                    const displaySchedule: IDisplaySchedule = {
                        ...schedule,
                        exercises: scheduleIdExerciseMap.get(schedule.schedule_name),
                        dateHeader: getDateHeader(schedule.day_of_week, daysOfNextScheduledSessions),
                        isToday: isScheduleDayToday(schedule.day_of_week)
                    };
                    displaySchedules.push(displaySchedule);
                }
            });
            setSchedules(displaySchedules);
            console.info("Loaded data");
        }).catch((error) => {
            toast({
                title: "Error loading schedule",
                description: "There was a problem: " + error,
                action: <ToastAction altText="">OK</ToastAction>,
            })
        });
    }

    /**
     * - Synchronize workout data
     * - Set session start time
     * @param scheduleExercise
     * @param setNumber
     */
    function updateSessionData(scheduleExercise: IExerciseInfo, setNumber: number): void {
        // Set session started/start time
        setIsSessionStarted(true);
        if (!sessionStartTime) {
            setSessionStartTime(new Date());
        }

        // Initialize current set if necessary
        if (typeof sessionData[setNumber] !== 'object') {
            sessionData[setNumber] = new Map();
            console.log('setting session data to map: ' + typeof sessionData[setNumber]);
        }

        if (typeof buttonStateMap[setNumber] === 'undefined') {
            buttonStateMap[setNumber] = new Map();
        }

        // Calculate current rep and set
        const exerciseInfo: IExerciseInfo = sessionData[setNumber].get(scheduleExercise.exerciseName);
        console.log("Exercise name: " + scheduleExercise.exerciseName);
        console.log("Session data: ", sessionData[setNumber]);
        console.log("Exercise info:" + exerciseInfo);
        const currentRepetition: number = exerciseInfo?.repetitions || 0;

        console.log("Current repetition: ", currentRepetition);

        // TODO: refactor to use session data instead
        const buttonState: Map<string, CounterButtonState>[] = buttonStateMap;
        const buttonLimit: number = scheduleExercise.sets;
        console.log("Current repetition: ", currentRepetition);
        const {countValue, bgColor} = getButtonState(currentRepetition, buttonLimit);
        console.log("Count value: ", countValue);
        buttonState[setNumber].set(scheduleExercise.exerciseName, {
            countValue,
            bgColor
        });
        setButtonStateMap(buttonState);

        // Set updated data
        const updatedExerciseData: IExerciseInfo = {
            ...scheduleExercise,
            repetitions: countValue,
            sets: sessionData.length
        }

        // Update session data
        sessionData[setNumber].set(scheduleExercise.exerciseName, updatedExerciseData);
        setExerciseNameDetailsMap(sessionData[setNumber]);

        //console.log("Updated exercise data: ", sessionData[setNumber]);

        console.log("Updated session data: ", sessionData[setNumber].get(scheduleExercise.exerciseName));
    }

    /**
     * - Synchronize workout data
     * - Update button color/value
     * @param scheduleExercise
     * @param setNumber
     */
    function onCounterButtonClicked(scheduleExercise: IExerciseInfo, setNumber: number): void {
        updateSessionData(scheduleExercise, setNumber);
    }

    function getCounterButtonsForSets(scheduleExercise: IExerciseInfo, isToday: boolean): ReactElement {
        const inactiveButtonColor: string = 'bg-[var(--color-background)]';
        // Initialize button state map
        for (let i = 0; i < scheduleExercise.sets; i++) {
            if (typeof buttonStateMap[i] === 'undefined') {
                buttonStateMap[i] = new Map();
            }
        }
        return (
            <ul className="list-none counter-button-list flex justify-between">
                {[...Array(scheduleExercise.sets).keys()].map((setNumber: number) => (
                    <li key={setNumber}>
                        {/*
                            readOnly={!isToday}
                            onClickCallback={() => isToday ? onCounterButtonClicked(scheduleExercise, setNumber) : {}}
                            {isToday ? buttonStateMap[setNumber].get(scheduleExercise.exerciseName)?.countValue || 0 : 0}
                        */}
                        <CounterButton
                            onClickCallback={() => onCounterButtonClicked(scheduleExercise, setNumber)}
                            className="mr-3"
                            readOnly={!DEBUG_MODE && !isToday}
                            bgColor={isToday ? buttonStateMap[setNumber].get(scheduleExercise.exerciseName)?.bgColor || inactiveButtonColor : inactiveButtonColor}
                            value={buttonStateMap[setNumber].get(scheduleExercise.exerciseName)?.countValue || 0}
                        />
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
        const sessionData: Session = {
            start_timestamp: sessionStartTime.toString(),
            end_timestamp: sessionEndTime.toString(),
            program_id: programId.toString(),
        };
        return sessionsAPI.sessionsCreate(sessionData);
    }

    useEffect(loadData, []);

    return (
        <>
            {schedules.length === 0 ? 'No schedules found.' : ''}
            {schedules.map((schedule: IDisplaySchedule, index: number) => (
                <Card key={index} className="mt-3" data-testid={'schedule-card-' + index}>
                    <CardHeader>
                        <CardTitle>
                            <div className="flex justify-between">
                                <h4 className="text-lg font-medium" key={schedule.day_of_week}>
                                    Workout {schedule.schedule_name}
                                </h4>
                                <h4 className="text-lg font-medium">
                                    <FontAwesomeIcon
                                        icon={faCalendarDay}/>&nbsp; {schedule.dateHeader}
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
                                                {getCounterButtonsForSets(exercise, schedule.isToday)}
                                            </td>
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </table>
                        ) : 'No exercises found.'}
                    </CardContent>
                    {schedule.isToday && isSessionStarted ? (
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