import './DateSelector.css'
import DayCard from "../day-card/DayCard"
import MonthYearSelector from "../month-year-selector/MonthYearSelector"
import { useState } from 'react';

export default function DateSelector() {
    const now = new Date;
    const todayMonth = now.getMonth();
    const todayYear = now.getFullYear();
    const [selectedDay, setSelectedDay] = useState(now.getDate);
    
    return (
        <div className="date-selector">
            <MonthYearSelector 
                selectedMonth={todayMonth} 
                selectedYear={todayYear}>
            </MonthYearSelector>
            <div className="week-row">
                
            </div>
        </div>
    )
}