import './DayCard.css';

interface DayCardProps {
    date: string
    status: string
}

export default function DayCard({date, status}:DayCardProps) {
    return (
        <div className="day-card">
            <span className='day-card-date'>{date}</span>
                <span className="day-card-status">{status}</span>
        </div>
    )
}