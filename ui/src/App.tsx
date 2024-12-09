import './App.css'

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
                <menu className="p-3 w-32 bg-slate-500 border-solid border-black border-2">
                    <ul className="list-none">
                        <li><a href="/programs" title="Program list">Programs</a></li>
                    </ul>
                </menu>
            </main>
        </>
    )
}

export default App
