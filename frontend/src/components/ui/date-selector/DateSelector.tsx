import './DateSelector.css'
import DayCard from "../day-card/DayCard"
import MonthYearSelector from "../month-year-selector/MonthYearSelector"
import { useState } from 'react';

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

    
    return (
        <div className="date-selector">
            <MonthYearSelector
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onMonthChange={handleMonthChange}
                onYearChange={handleYearChange}
            />
            <div className="week-row">
                
            </div>
        </div>
    )
}