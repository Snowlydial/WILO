import './DateSelector.css'

import { useEffect } from 'react';

import DayCard from "../day-card/DayCard"
import MonthYearSelector from "../month-year-selector/MonthYearSelector"
import { useState } from 'react';

import { dayHeaders, getWeekDates } from '../../../utils/DateUtil';
import type { LogStatus } from '../../../types/log/LogStatus';
import { formatDateForApi } from '../../../utils/DateUtil';
import { getStatusRange } from '../../../services/LogService';

type DateSelectorProps = {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
}

export default function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
    const [viewDate, setViewDate] = useState(selectedDate);
    const [statuses, setStatuses] = useState<Map<string, LogStatus>>(new Map());

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
        onDateChange(date);
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

    useEffect(() => {
        const start = formatDateForApi(weekDates[0]);
        const end = formatDateForApi(weekDates[6]);
        getStatusRange(start, end).then((results) => {
            const map = new Map(results.map((s) => [s.dateFor, s]));
            setStatuses(map);
        });
    }, [viewDate]);
    
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
                {weekDates.map((date, index) => {
                    const dateStr = formatDateForApi(date);
                    const status = statuses.get(dateStr);
                    return (
                        <DayCard
                            key={date.toISOString()}
                            day={String(date.getDate())}
                            dayTag={dayHeaders[index]}
                            status={status ? (status.isDone ? 'done' : 'open') : 'none'}
                            isSelected={date.toDateString() === selectedDate.toDateString()}
                            onDayChange={() => onDateChange(date)}
                        />
                    );
                })}
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