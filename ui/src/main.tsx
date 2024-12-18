import {StrictMode, Suspense} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter, Route, Routes} from 'react-router'
import ProgramsPage from "./lib/routes/programs.tsx";
import SessionsPage from "./lib/routes/sessions.tsx";
import {Loader} from "lucide-react";
import SchedulePage from "./lib/routes/schedule.tsx";

createRoot(document.getElementById('root')!).render(
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
    </StrictMode>,
)

