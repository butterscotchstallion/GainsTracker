import {Program} from "../components/api/generated";
import {programsAPI} from "../components/api/api.ts";
import {useEffect, useState} from "react";
import {AxiosPromise, AxiosResponse} from "axios";
import {format} from 'date-fns';

const programs$: AxiosPromise<Program[]> = programsAPI.programsList();

export default function ProgramsPage() {
    const [results, setResults] = useState<Program[]>([]);

    useEffect(() => {
        programs$.then((response: AxiosResponse<Program[]>) => {
            setResults(response.data);
        });
    }, []);

    return (
        <>
            <h1>Programs</h1>
            <table className="mt-3 min-w-80">
                <thead>
                <tr>
                    <th className={"text-left"}>Name</th>
                    <th className={"text-left"}>Date</th>
                </tr>
                </thead>
                <tbody>
                {results && results.map((program: Program) => (
                    <tr key={program.program_name}>
                        <td>{program.program_name}</td>
                        <td>{format(new Date(program.pub_date), "MMM dd yyyy")}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    )
}