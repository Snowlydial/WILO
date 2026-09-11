import './DayCard.css';

interface DayCardProps {
    day: string
    dayTag: string
    status: string
    isSelected: boolean
    onDayChange: () => void
}

export default function DayCard({day, dayTag, status, isSelected, onDayChange}:DayCardProps) {
    return (
        <div className={`day-card ${isSelected ? 'day-card-selected' : ''}`} onClick={onDayChange}>
            <div className="day-info">
                <span className='day-card-tag'>{dayTag}</span>
                <span className='day-card-day'>{day}</span>
            </div>
            <span className="day-card-status">{status}</span>
        </div>
    )
}