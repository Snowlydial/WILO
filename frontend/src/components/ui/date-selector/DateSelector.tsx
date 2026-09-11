import './DateSelector.css'
import DayCard from "../day-card/DayCard"
import MonthYearSelector from "../month-year-selector/MonthYearSelector"
import { useState, useEffect } from 'react';

import type { LogResponse } from '../../../types/log/LogResponse';
import { dayHeaders, formatDateForApi, getWeekDates } from '../../../utils/DateUtil';

export default function DateSelector() {
    const now = new Date;
    const [selectedDate, setSelectedDate] = useState(now);
    const [viewDate, setViewDate] = useState(now);

    const selectedMonth = viewDate.getMonth();
    const selectedYear = viewDate.getFullYear();

    function handleMonthChange(month: number) {
        const updated = new Date(viewDate);
        updated.setMonth(month);
        setViewDate(updated);
    }

    function handleYearChange(year: number) {
        const updated = new Date(viewDate);
        updated.setFullYear(year);
        setViewDate(updated);
    }

    function handleDaySelect(date: Date) {
        setSelectedDate(date);
        setViewDate(date);
    }

    const weekDates = getWeekDates(viewDate);

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
            {/* <span className='Debug'>Debug: curr date {String(selectedDate)}</span> */}

            <MonthYearSelector
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onMonthChange={handleMonthChange}
                onYearChange={handleYearChange}
                onDaySelect={handleDaySelect}
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
                        dayTag={dayHeaders[index]}
                        status="status"
                        isSelected={date.toDateString() === selectedDate.toDateString()}
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