import {NavLink} from "react-router";
import Button from "../components/Button.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendarDays, faDumbbell, faRectangleList} from "@fortawesome/free-solid-svg-icons";
import React from "react";

type Props = {
    children: React.ReactNode
}

export default function BaseLayout({children}: Props) {
    return (
        <>
            <div className="flex items-stretch bg-secondary w-full">
                <header className="w-full p-4 bg-secondary">
                    <div className="content-center inline-block">
                        <NavLink to="/" end>
                            <div className="flex justify-between">
                                <div className="bg-white w-3"></div>
                                <h1 className="text-2xl text-white capitalize logo-header border-b-8 border-solid border-white pl-3 pr-3">
                                    Gains Tracker
                                </h1>
                                <div className="bg-white w-3"></div>
                            </div>
                            <div className="flex justify-between h-7">
                                <div className="bg-white w-3"></div>
                                <div className="w-32"></div>
                                <div className="bg-white w-3"></div>
                            </div>
                        </NavLink>
                    </div>
                </header>
            </div>
            <main className="bg-background w-full h-screen">
                <div className="flex bg-background">
                    <menu className="flex-none h-screen">
                        <li className="p-4">
                            <NavLink to="/schedule" end>
                                <Button>
                                    <FontAwesomeIcon icon={faCalendarDays}/>&nbsp; Schedule
                                </Button>
                            </NavLink>
                        </li>
                        <li className="p-4">
                            <NavLink to="/sessions" end>
                                <Button>
                                    <FontAwesomeIcon icon={faDumbbell}/>&nbsp; Sessions
                                </Button>
                            </NavLink>
                        </li>
                        <li className="p-4">
                            <NavLink to="/programs" end>
                                <Button>
                                    <FontAwesomeIcon icon={faRectangleList}/>&nbsp;  Programs
                                </Button>
                            </NavLink>
                        </li>
                    </menu>

                    <div className="pt-1 pl-3 pr-4 pb-4 grow">
                        <article className="text-pretty flow-text break-words">
                            {children}
                        </article>
                    </div>
                </div>
            </main>
        </>
    )
}