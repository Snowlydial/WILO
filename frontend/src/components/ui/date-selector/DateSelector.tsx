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

    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();

    function handleMonthChange(month: number) {
        const updated = new Date(selectedDate);
        updated.setMonth(month);
        setSelectedDate(updated);
    }

    function handleYearChange(year: number) {
        const updated = new Date(selectedDate);
        updated.setFullYear(year);
        setSelectedDate(updated);
    }

    const weekDates = getWeekDates(selectedDate);
    const dayTag: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    
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
                {weekDates.map((date) => (
                    <DayCard
                        key={date.toISOString()}
                        day={String(date.getDate())}
                        dayTag={dayTag[index]}
                        status="status"
                        onDayChange={() => setSelectedDate(date)}
                    />
                ))}
            </div>
        </div>
    )
}