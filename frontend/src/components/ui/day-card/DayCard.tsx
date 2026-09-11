import './DayCard.css';

interface DayCardProps {
    day: string
    dayTag: string
    status: string
    onDayChange: () => void
}

export default function DayCard({day, dayTag, status, onDayChange}:DayCardProps) {
    return (
        <div className="day-card" onClick={onDayChange}>
            <div className="day-info">
                <span className='day-card-tag'>{dayTag}</span>
                <span className='day-card-day'>{day}</span>
            </div>
            <span className="day-card-status">{status}</span>
        </div>
    )
}