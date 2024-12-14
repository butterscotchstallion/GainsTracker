import './App.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCalendarDays,
    faDumbbell,
    faGhost,
    faRectangleList,
    faWandMagicSparkles
} from "@fortawesome/free-solid-svg-icons";

function App() {
    return (
        <>
            <div className="flex items-stretch bg-darkBg w-full">
                <header className="w-full p-4 bg-headerBg">
                    <div className="w-32 content-center inline-block">
                        <a href="/" title="Gains Tracker">
                            <img src="images/logo.png" className="border-0" alt="Gains Tracker" width="250"
                                 height="150"/>
                        </a>
                    </div>
                </header>
            </div>
            <main className="p-2 bg-slate-300 w-full h-screen">
                <div className="grid grid-flow-col auto-cols-max">
                    <menu className="bg-slate-500 border-solid border-black border-2">
                        <div className="grid grid-cols-1 divide-y">
                            <div className="p-3">
                                <a className="block" href="/sessions" title="Sessions">
                                    <FontAwesomeIcon icon={faDumbbell}/> Sessions
                                </a>
                            </div>
                            <div className="p-3">
                                <a className="block" href="/sessions" title="Programs">
                                    <FontAwesomeIcon icon={faRectangleList}/> Programs
                                </a>
                            </div>
                            <div className="p-3">
                                <a className="block" href="/test" title="Test">
                                    <FontAwesomeIcon icon={faWandMagicSparkles}/> Lorem</a>
                            </div>
                            <div className="p-3">
                                <a className="block" href="/test" title="Test">
                                    <FontAwesomeIcon icon={faCalendarDays}/> Ipsum Doler</a>
                            </div>
                            <div className="p-3">
                                <a className="block" href="/test" title="Test">
                                    <FontAwesomeIcon icon={faGhost}/> Amit A Sandwich
                                </a>
                            </div>
                        </div>
                    </menu>
                    <div className="pl-2 pr-2 pb-2">
                        Hello I am the content.
                    </div>
                </div>
            </main>
        </>
    )
}

export default App
