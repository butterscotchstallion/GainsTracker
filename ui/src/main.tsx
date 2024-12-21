import React, {StrictMode, Suspense} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter, Route, Routes} from 'react-router'
import {Loader} from "lucide-react";

const SchedulePage = React.lazy(() => import("./lib/routes/schedule.tsx"));
const ProgramsPage = React.lazy(() => import("./lib/routes/programs.tsx"));
const SessionsPage = React.lazy(() => import("./lib/routes/sessions.tsx"));

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Suspense fallback={<Loader/>}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App/>}>
                        <Route path="schedule" element={<SchedulePage/>}/>
                        <Route path="programs" element={<ProgramsPage/>}/>
                        <Route path="sessions" element={<SessionsPage/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </Suspense>
    </StrictMode>
);

