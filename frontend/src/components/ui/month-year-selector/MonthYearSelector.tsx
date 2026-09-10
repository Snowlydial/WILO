import './MonthYearSelector.css'

import { useState } from "react";
import Modal from "../modal/Modal";

type MonthYearSelectorProps = {
    selectedMonth: number,
    selectedYear: number,
    onMonthChange: (month: number) => void,
    onYearChange: (year: number) => void,
}

const months: string[] = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
];

function formatMonthYear(selectedMonth:number, selectedYear:number) {
    const monthString:string = months[selectedMonth];
    return monthString + " " + String(selectedYear);
}

function getYearRange(centerYear: number, span: number = 7): number[] {
    const startYear = centerYear - Math.floor(span / 2);
    return Array.from({ length: span }, (_, i) => startYear + i);
}

export default function MonthYearSelector({selectedMonth, selectedYear, onMonthChange, onYearChange}:MonthYearSelectorProps) {
    const [showSelector, setShowSelector] = useState(false);

    const monthYearDisplay = formatMonthYear(selectedMonth, selectedYear);
    const yearRange = getYearRange(selectedYear);

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
                    <select name="selector-month" id="selector-month"
                        value={selectedMonth}
                        onChange={(e) => onMonthChange(Number(e.target.value))}
                    >
                        {months.map((month, index) => (
                            <option key={index} value={index}>{month}</option>
                        ))}
                    </select>
                    <select name="selector-year" id="selector-year"
                        value={selectedYear}
                        onChange={(e) => onYearChange(Number(e.target.value))}
                    >
                        {yearRange.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </Modal>
            )}
        </>
    )
}
