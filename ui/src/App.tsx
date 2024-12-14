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
                <menu className="w-40 bg-slate-500 border-solid border-black border-2">
                    <div className="grid grid-cols-1 divide-y">
                        <div className="p-3"><a href="/sessions" title="Sessions">Sessions</a></div>
                        <div className="p-3"><a href="/sessions" title="Sessions">Programs</a></div>
                        <div className="p-3"><a href="/test" title="Test">Lorem</a></div>
                        <div className="p-3"><a href="/test" title="Test">Ipsum Doler</a></div>
                        <div className="p-3"><a href="/test" title="Test">Amit A Sandwich</a></div>
                    </div>
                </menu>
            </main>
        </>
    )
}

export default App
