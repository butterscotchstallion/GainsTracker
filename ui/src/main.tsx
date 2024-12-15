import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter, Route, Routes} from 'react-router'
import ProgramsPage from "./lib/pages/programs.tsx";
import SessionsPage from "./lib/pages/sessions.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route index element={<App/>}/>
                <Route path="sessions" element={<SessionsPage/>}/>
                <Route path="programs" element={<ProgramsPage/>}/>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)

