import './App.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDumbbell, faRectangleList} from "@fortawesome/free-solid-svg-icons";
import Button from "./lib/components/button.tsx";
import {NavLink, Outlet} from "react-router";

function App() {
    return (
        <>
            <div className="flex items-stretch bg-darkBg w-full">
                <header className="w-full p-4 bg-headerBg">
                    <div className="w-32 content-center inline-block">
                        <NavLink to="/" end>
                            <img src="images/logo.png" className="border-0" alt="Gains Tracker" width="250"
                                 height="150"/>
                        </NavLink>
                    </div>
                </header>
            </div>

            <main className="bg-slate-300 w-full h-screen">
                <div className="flex">
                    <menu className="flex-none h-screen">
                        <div className="p-4">
                            <NavLink to="/sessions" end>
                                <Button>
                                    <FontAwesomeIcon icon={faDumbbell}/>&nbsp; Sessions
                                </Button>
                            </NavLink>
                        </div>
                        <div className="p-4">
                            <NavLink to="/programs" end>
                                <Button>
                                    <FontAwesomeIcon icon={faRectangleList}/>&nbsp;  Programs
                                </Button>
                            </NavLink>
                        </div>
                    </menu>

                    <div className="pt-1 pl-3 pr-4 pb-4 grow">
                        <article className="text-pretty flow-text break-words">
                            <Outlet/>
                        </article>
                    </div>
                </div>
            </main>
        </>
    )
}

export default App
