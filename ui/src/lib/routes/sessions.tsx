import {AxiosPromise, AxiosResponse} from "axios";
import {Session} from "../components/api/generated";
import {sessionsAPI} from "../components/api/api.ts";
import {useEffect, useState} from "react";
import {format} from "date-fns";
import {Card, CardContent} from "../components/Card.tsx";
import Button from "../components/Button.tsx";
import {faSquarePlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const sessions$: AxiosPromise<Session[]> = sessionsAPI.sessionsList();

export default function SessionsPage() {
    const [sessions, setSessions] = useState<Session[]>([]);

    useEffect(() => {
        sessions$.then((response: AxiosResponse<Session[]>) => {
            setSessions(response.data);
        });
    }, []);

    return (
        <>
            <main className="max-w-lg md:max-w-2xl">
                <div className="flex justify-between">
                    <h1 className="gt-header">Sessions</h1>

                    <Button><FontAwesomeIcon icon={faSquarePlus}/>&nbsp; Start Session</Button>
                </div>
                {sessions.length > 0 ? (

                    <Card className="mt-3">
                        <CardContent>
                            <table className="mt-3 min-w-80">
                                <thead>
                                <tr>
                                    <th className={"text-left"}>Date</th>
                                    <th className={"text-left"}>Sets</th>
                                    <th className={"text-left"}>Repetitions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {sessions && sessions.map((session: Session) => (
                                    <tr key={session.pub_date}>
                                        <td>{format(new Date(session.pub_date), "MMM dd yyyy")}</td>
                                        <td>{session.num_sets}</td>
                                        <td>{session.num_repetitions}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>

                ) : 'No sessions found.'}
            </main>
        </>
    )
}