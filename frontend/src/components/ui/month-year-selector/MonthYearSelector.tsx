import './MonthYearSelector.css'

import { useState } from "react";
import Modal from "../modal/Modal";

import { months, dayHeaders, formatMonthYear } from '../../../utils/DateUtil';

type MonthYearSelectorProps = {
    selectedMonth: number,
    selectedYear: number,
    onMonthChange: (month: number) => void,
    onYearChange: (year: number) => void,
    onDaySelect: (date: Date) => void,
}

function getYearRange(centerYear: number, span: number = 7): number[] {
    const startYear = centerYear - Math.floor(span / 2);
    return Array.from({ length: span }, (_, i) => startYear + i);
}

function getMonthGridDates(month: number, year: number): (Date | null)[] {
    const firstOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = (firstOfMonth.getDay() === 0) ? 6 : firstOfMonth.getDay() - 1;

    const grid: (Date | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
        grid.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
        grid.push(new Date(year, month, d));
    }
    return grid;
}

export default function MonthYearSelector({selectedMonth, selectedYear, onMonthChange, onYearChange, onDaySelect}:MonthYearSelectorProps) {
    const [showSelector, setShowSelector] = useState(false);

    const monthYearDisplay = formatMonthYear(selectedMonth, selectedYear);
    const yearRange = getYearRange(selectedYear);
    const monthGrid = getMonthGridDates(selectedMonth, selectedYear);

    function handlePrev() {
        if(selectedMonth===0) {
            onMonthChange(11);
            onYearChange(selectedYear - 1)
        } else {
            onMonthChange(selectedMonth-1);
        }
    }

    function handleNext() {
        if(selectedMonth===11) {
            onMonthChange(0);
            onYearChange(selectedYear +1)
        } else {
            onMonthChange(selectedMonth+1);
        }
    }

    function handleDayClick(date: Date) {
        onDaySelect(date);
        setShowSelector(false);
    }
    
    return (
        <>
            <div className="month-year-selector">
                <button
                    className='selector-arrow'
                    onClick={handlePrev}
                >
                    <img src="/icons/arrow-left.svg" alt="previous"/>
                </button>
                <button 
                    className="selector-btn"
                    onClick={() => setShowSelector(true)}
                >
                    {monthYearDisplay}
                </button>
                <button
                    className='selector-arrow'
                    onClick={handleNext}
                >
                    <img src="/icons/arrow-right.svg" alt="next"/>
                </button>
            </div>
        
            {showSelector && (
                <Modal
                    title="Select Month/Year"
                    onClose={() => setShowSelector(false)}
                    className="my-selector-itself"
                >
                    <div className="selector-dropdowns">
                        <select
                            value={selectedMonth}
                            onChange={(e) => onMonthChange(Number(e.target.value))}
                        >
                            {months.map((month, index) => (
                                <option key={index} value={index}>{month}</option>
                            ))}
                        </select>
                        <select
                            value={selectedYear}
                            onChange={(e) => onYearChange(Number(e.target.value))}
                        >
                            {yearRange.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    <div className="calendar-grid">
                        {dayHeaders.map((d) => (
                            <span key={d} className="calendar-day-header">{d}</span>
                        ))}
                        {monthGrid.map((date, i) => (
                            date ? (
                                <button
                                    key={i}
                                    className="calendar-day-cell"
                                    onClick={() => handleDayClick(date)}
                                >
                                    {date.getDate()}
                                </button>
                            ) : (
                                <span key={i} className="calendar-day-cell-empty" />
                            )
                        ))}
                    </div>

                </Modal>
            )}
        </>
    )
}
