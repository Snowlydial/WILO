import './MonthYearSelector.css'

import { useState } from "react";
import Modal from "../modal/Modal";

type MonthYearSelectorProps = {
    selectedMonth: number,
    selectedYear: number
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

export default function MonthYearSelector({selectedMonth, selectedYear}:MonthYearSelectorProps) {
    const [currentMonth, setCurrentMonth] = useState(selectedMonth);
    const [currentYear, setCurrentYear] = useState(selectedYear);
    const [showSelector, setShowSelector] = useState(false);

    function recomputeMonthYear(): string {
        return formatMonthYear(currentMonth, currentYear);
    }

    const monthYearDisplay = recomputeMonthYear();
    const yearRange = getYearRange(currentYear);

    function handlePrev() {
        if(currentMonth===0) {
            setCurrentMonth(11);
            setCurrentYear((cur)=> cur-1)
        } else {
            setCurrentMonth((cur)=>cur-1);
        }
    }

    function handleNext() {
        if(currentMonth===11) {
            setCurrentMonth(0);
            setCurrentYear((cur)=> cur+1)
        } else {
            setCurrentMonth((cur)=>cur+1);
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
                        value={currentMonth}
                        onChange={(e) => setCurrentMonth(Number(e.target.value))}
                    >
                        {months.map((month, index) => (
                            <option key={index} value={index}>{month}</option>
                        ))}
                    </select>
                    <select name="selector-year" id="selector-year"
                        value={currentYear}
                        onChange={(e) => setCurrentYear(Number(e.target.value))}
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
