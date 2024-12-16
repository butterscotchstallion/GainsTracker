import './App.css'
import BaseLayout from "./lib/routes/BaseLayout.tsx";
import {Outlet} from "react-router";

function App() {
    return (
        <>
            <BaseLayout>
                <Outlet/>
            </BaseLayout>
        </>
    )
}

export default App
