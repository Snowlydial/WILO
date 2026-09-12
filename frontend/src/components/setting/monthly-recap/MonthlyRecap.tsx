import { useState, useEffect } from 'react';
import { getStatusRange } from '../../../services/LogService';
import { formatDateForApi } from '../../../utils/DateUtil';
import type { LogStatus } from '../../../types/log/LogStatus';
import './MonthlyRecap.css';

interface MonthlyRecapProps {
    onSelectDay: (date: string) => void;
}

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
const dayHeaders = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getMonthGridDates(month: number, year: number): (Date | null)[] {
    const firstOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = (firstOfMonth.getDay() === 0) ? 6 : firstOfMonth.getDay() - 1;

    const grid: (Date | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) grid.push(null);
    for (let d = 1; d <= daysInMonth; d++) grid.push(new Date(year, month, d));
    return grid;
}

export default function MonthlyRecap({ onSelectDay }: MonthlyRecapProps) {
    const now = new Date();
    const [month, setMonth] = useState(now.getMonth());
    const [year, setYear] = useState(now.getFullYear());
    const [statuses, setStatuses] = useState<Map<string, LogStatus>>(new Map());

    useEffect(() => {
        const grid = getMonthGridDates(month, year).filter((d): d is Date => d !== null);
        const start = formatDateForApi(grid[0]);
        const end = formatDateForApi(grid[grid.length - 1]);
        getStatusRange(start, end).then((results) => {
            setStatuses(new Map(results.map((s) => [s.dateFor, s])));
        });
    }, [month, year]);

    function handlePrev() {
        if (month === 0) { setMonth(11); setYear(y => y - 1); }
        else setMonth(m => m - 1);
    }

    function handleNext() {
        if (month === 11) { setMonth(0); setYear(y => y + 1); }
        else setMonth(m => m + 1);
    }

    const grid = getMonthGridDates(month, year);
    const realDays = grid.filter((d): d is Date => d !== null);
    const doneCount = realDays.filter((d) => statuses.get(formatDateForApi(d))?.isDone).length;
    const openCount = realDays.filter((d) => {
        const s = statuses.get(formatDateForApi(d));
        return s && !s.isDone;
    }).length;

    return (
        <div className="recap">
            <div className="recap-header">
                <button className="recap-arrow" onClick={handlePrev}>←</button>
                <span className="recap-title">{months[month]} {year}</span>
                <button className="recap-arrow" onClick={handleNext}>→</button>
            </div>

            <div className="recap-stats">
                <span className="recap-stat recap-stat-done">✓ {doneCount} done</span>
                <span className="recap-stat recap-stat-open">● {openCount} open</span>
            </div>

            <div className="recap-grid">
                {dayHeaders.map((d) => (
                    <span key={d} className="recap-day-header">{d}</span>
                ))}
                {grid.map((date, i) => {
                    if (!date) return <span key={i} className="recap-cell-empty" />;
                    const dateStr = formatDateForApi(date);
                    const status = statuses.get(dateStr);
                    const statusClass = status
                        ? (status.isDone ? 'recap-cell-done' : 'recap-cell-open')
                        : '';
                    return (
                        <button
                            key={i}
                            className={`recap-cell ${statusClass}`}
                            onClick={() => onSelectDay(dateStr)}
                        >
                            {date.getDate()}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}