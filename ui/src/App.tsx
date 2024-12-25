import './styles/App.css'
import BaseLayout from "./lib/routes/BaseLayout.tsx";
import {Outlet} from "react-router";
import {changeTheme} from "./lib/components/themeSwitcher.ts";

function App() {
    const themeName = localStorage.getItem('theme') || 'plum';
    changeTheme(themeName);

    return (
        <>
            <BaseLayout>
                <Outlet/>
            </BaseLayout>
        </>
    )
}

export default App
