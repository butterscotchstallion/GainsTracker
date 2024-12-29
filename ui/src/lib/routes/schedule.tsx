import ScheduleComponent from "../components/Schedule/Schedule.tsx";

export default function SchedulePage() {
    return (
        <>
            <h1 className="gt-header-font gt-header-color">Schedule</h1>
            <main className="max-w-xl md:max-w-2xl">
                <ScheduleComponent/>
            </main>
        </>
    )
}