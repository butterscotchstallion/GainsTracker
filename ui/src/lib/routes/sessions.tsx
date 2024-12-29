import {AxiosPromise, AxiosResponse} from "axios";
import {Session} from "../components/api/generated";
import {sessionsAPI} from "../components/api/api.ts";
import {useEffect, useState} from "react";
import {format} from "date-fns";
import {Card, CardContent} from "../components/Card.tsx";

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
                    <h1 className="gt-header-font gt-header-color">Sessions</h1>
                </div>
                {sessions.length > 0 ? (

                    <Card className="mt-3">
                        <CardContent>
                            <table className="mt-3 min-w-80">
                                <thead>
                                <tr>
                                    <th className={"text-left"}>Date</th>
                                </tr>
                                </thead>
                                <tbody>
                                {sessions && sessions.map((session: Session) => (
                                    <tr key={session.start_timestamp}>
                                        <td>{format(new Date(session.start_timestamp), "MMM dd yyyy")}</td>
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