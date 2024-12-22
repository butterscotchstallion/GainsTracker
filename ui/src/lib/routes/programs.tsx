import {Program} from "../components/api/generated";
import {programsAPI} from "../components/api/api.ts";
import {useEffect, useState} from "react";
import {AxiosPromise, AxiosResponse} from "axios";
import {format} from 'date-fns';
import {Card, CardContent} from "../components/Card.tsx";

const programs$: AxiosPromise<Program[]> = programsAPI.programsList();

export default function ProgramsPage() {
    const [programs, setPrograms] = useState<Program[]>([]);

    useEffect(() => {
        programs$.then((response: AxiosResponse<Program[]>) => {
            setPrograms(response.data);
        });
    }, []);

    return (
        <>
            <h1>Programs</h1>
            {programs.length > 0 ? (
                <main className="max-w-lg md:max-w-2xl">
                    <Card className="mt-3">
                        <CardContent>
                            <table className="mt-3 min-w-80">
                                <thead>
                                <tr>
                                    <th className={"text-left"}>Name</th>
                                    <th className={"text-left"}>Created Date</th>
                                </tr>
                                </thead>
                                <tbody>
                                {programs && programs.map((program: Program) => (
                                    <tr key={program.program_name}>
                                        <td>{program.program_name}</td>
                                        <td>{format(new Date(program.pub_date), "MMM dd yyyy")}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </main>
            ) : 'No programs found.'}
        </>
    )
}