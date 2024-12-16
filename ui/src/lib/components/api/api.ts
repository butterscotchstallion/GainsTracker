import {Configuration, Program, ProgramsApiFactory} from "./generated";
import {AxiosPromise, RawAxiosRequestConfig} from "axios";

const configuration = new Configuration({
    basePath: "http://127.0.0.1:8000/api",
});

export let programsAPI: {
    programsCreate(data: Program, options?: RawAxiosRequestConfig): AxiosPromise<Program>;
    programsDelete(id: number, options?: RawAxiosRequestConfig): AxiosPromise<void>;
    programsList(options?: RawAxiosRequestConfig): AxiosPromise<Array<Program>>;
    programsPartialUpdate(id: number, data: Program, options?: RawAxiosRequestConfig): AxiosPromise<Program>;
    programsRead(id: number, options?: RawAxiosRequestConfig): AxiosPromise<Program>;
    programsUpdate(id: number, data: Program, options?: RawAxiosRequestConfig): AxiosPromise<Program>
};
programsAPI = ProgramsApiFactory(configuration);


