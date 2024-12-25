import React, {Suspense} from 'react'
import {createRoot} from 'react-dom/client'
import './styles/index.scss'
import App from './App.tsx'
import {BrowserRouter, Navigate, Route, Routes} from 'react-router'
import Throbber from "./lib/components/Throbber.tsx";

const SchedulePage = React.lazy(() => import("./lib/routes/schedule.tsx"));
const ProgramsPage = React.lazy(() => import("./lib/routes/programs.tsx"));
const SessionsPage = React.lazy(() => import("./lib/routes/sessions.tsx"));

createRoot(document.getElementById("root")!).render(
    <Suspense fallback={<Throbber/>}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App/>}>
                    <Route path="" element={<SchedulePage/>}/>
                    <Route path="schedule" element={<SchedulePage/>}/>
                    <Route path="programs" element={<ProgramsPage/>}/>
                    <Route path="sessions" element={<SessionsPage/>}/>
                </Route>
                <Route path="*" element={<Navigate to="/schedule"/>}/>
            </Routes>
        </BrowserRouter>
    </Suspense>
);

