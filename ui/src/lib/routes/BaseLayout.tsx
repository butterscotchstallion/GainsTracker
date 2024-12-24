import {NavLink} from "react-router";
import Button from "../components/Button.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendarDays, faDumbbell, faPalette, faRectangleList} from "@fortawesome/free-solid-svg-icons";
import React, {ChangeEvent} from "react";
import {changeTheme} from "../components/themeSwitcher.ts";

type Props = {
    children: React.ReactNode
}

function changeThemeFromSelect(event: ChangeEvent<HTMLSelectElement>) {
    changeTheme(event.target.value);
}

export default function BaseLayout({children}: Props) {
    return (
        <>
            <div className="flex items-stretch bg-secondary w-full">
                <header className="w-full p-4 bg-secondary flex justify-between">
                    <div className="content-center">
                        <NavLink to="/" end>
                            <div className="flex h-20">
                                {/* left plates */}
                                <div className="flex justify-between">
                                    <div className="w-5 bg-black h-[8px] mt-[37px] align-middle"></div>
                                    <div className="bg-logoPlates h-full" style={{"width": "12px"}}></div>
                                    <div className="w-1 bg-black h-[8px] mt-[37px] align-middle"></div>
                                    <div className="bg-logoPlates h-full" style={{"width": "12px"}}></div>
                                    <div className="w-1 bg-black h-[8px] mt-[37px] align-middle"></div>
                                    <div className="bg-logoPlates h-full" style={{"width": "12px"}}></div>
                                </div>

                                <h1 className="h-[46px] text-2xl align-middle text-[var(--color-logo-text)] logo-header border-b-8 border-solid border-black pl-3 pr-3">
                                    Gains Tracker
                                </h1>

                                {/* right plates */}
                                <div className="flex justify-between">
                                    <div className="bg-logoPlates" style={{"width": "12px"}}></div>
                                    <div className="w-1 bg-black h-[8px] mt-[37px] align-middle"></div>
                                    <div className="bg-logoPlates" style={{"width": "12px"}}></div>
                                    <div className="w-1 bg-black h-[8px] mt-[37px] align-middle"></div>
                                    <div className="bg-logoPlates h-full" style={{"width": "12px"}}></div>
                                    <div className="w-5 bg-black h-[8px] mt-[37px] align-middle"></div>
                                </div>
                            </div>
                        </NavLink>
                    </div>
                    <div>
                        <label htmlFor="theme-selector" className="text-white block mb-1">
                            <FontAwesomeIcon icon={faPalette}/>&nbsp; Theme
                        </label>
                        <select onChange={changeThemeFromSelect} id="theme-selector"
                                className="block bg-secondary text-white">
                            <option value="plum">Plum</option>
                            <option value="verdant">verdant</option>
                        </select>
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