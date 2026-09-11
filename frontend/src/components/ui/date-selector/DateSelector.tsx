import './DateSelector.css'
import DayCard from "../day-card/DayCard"
import MonthYearSelector from "../month-year-selector/MonthYearSelector"
import { useState } from 'react';

function getWeekDates(selectedDate: Date): Date[] {
    const dayOfWeek = selectedDate.getDay();
    const mondayOffset = (dayOfWeek === 0) ? 6 : dayOfWeek - 1;

    const monday = new Date(selectedDate);
    monday.setDate(selectedDate.getDate() - mondayOffset);

    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return d;
    });
}

export default function DateSelector() {
    const now = new Date;
    const [selectedDate, setSelectedDate] = useState(now);
    const [viewDate, setViewDate] = useState(now);

    const selectedMonth = viewDate.getMonth();
    const selectedYear = viewDate.getFullYear();

    function handleMonthChange(month: number) {
        const updated = new Date(selectedDate);
        updated.setMonth(month);
        setViewDate(updated);
    }

    function handleYearChange(year: number) {
        const updated = new Date(selectedDate);
        updated.setFullYear(year);
        setViewDate(updated);
    }

    const weekDates = getWeekDates(viewDate);
    const dayTag: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    function handlePrevWeek() {
        const updated = new Date(viewDate);
        updated.setDate(viewDate.getDate() - 7);
        setViewDate(updated);
    }

    function handleNextWeek() {
        const updated = new Date(viewDate);
        updated.setDate(viewDate.getDate() + 7);
        setViewDate(updated);
    }
    
    return (
        <div className="date-selector">
            <span className='Debug'>Debug: curr date {String(selectedDate)}</span>

            <MonthYearSelector
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onMonthChange={handleMonthChange}
                onYearChange={handleYearChange}
            />
            <div className="week-row">
                <button
                    className='selector-arrow'
                    onClick={handlePrevWeek}
                >
                    <img src="/icons/arrow-left.svg" alt="previous"/>
                </button>
                {weekDates.map((date, index) => (
                    <DayCard
                        key={date.toISOString()}
                        day={String(date.getDate())}
                        dayTag={dayTag[index]}
                        status="status"
                        onDayChange={() => setSelectedDate(date)}
                    />
                ))}
                <button
                    className='selector-arrow'
                    onClick={handleNextWeek}
                >
                    <img src="/icons/arrow-right.svg" alt="next"/>
                </button>
            </div>
        </div>
    )
}