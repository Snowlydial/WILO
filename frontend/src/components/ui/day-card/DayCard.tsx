import './DayCard.css';

interface DayCardProps {
    date: string
    status: string
    onDayChange: () => void
}

export default function DayCard({date, status, onDayChange}:DayCardProps) {
    return (
        <div className="day-card" onClick={onDayChange}>
            <span className='day-card-date'>{date}</span>
                <span className="day-card-status">{status}</span>
        </div>
    )
}