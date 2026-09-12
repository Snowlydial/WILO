import './DayCard.css';

interface DayCardProps {
    day: string
    dayTag: string
    status: 'done' | 'open' | 'none'
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
            {status !== 'none' && (
                <span className={`day-card-status day-card-status-${status}`}>
                    {status === 'done' ? 'Done' : 'Open'}
                </span>
            )}
        </div>
    )
}