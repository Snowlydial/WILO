import './SearchNav.css'

import { useState } from 'react';
import type { LogResponse } from '../../../types/log/LogResponse';

interface SearchNavProps {
    query: string;
    onQueryChange: (value: string) => void;
    dueReminders: LogResponse[];
    onSelectReminder: (dateStr: string) => void;
}

export default function SearchNav({ query, onQueryChange, dueReminders, onSelectReminder }: SearchNavProps) {
    const [showDropdown, setShowDropdown] = useState(false);

    function handleSelect(dateStr: string) {
        onSelectReminder(dateStr);
        setShowDropdown(false);
    }

    return (
        <nav>
            <span className="logo">Logo</span>
            <div className="nav-right">
                <input
                    className="search-input"
                    type="text"
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    placeholder="Rechercher une note"
                />
                <div className="bell-wrapper">
                    <button onClick={() => setShowDropdown(!showDropdown)}>
                        <img src="/icons/bell.svg" alt="notification" />
                        {dueReminders.length > 0 && (
                            <span className="bell-badge">{dueReminders.length}</span>
                        )}
                    </button>

                    {showDropdown && (
                        <div className="bell-dropdown">
                            {dueReminders.length === 0 ? (
                                <span className="bell-empty">No due reminders</span>
                            ) : (
                                dueReminders.map((log) => (
                                    <div
                                        key={log.id}
                                        className="bell-item"
                                        onClick={() => handleSelect(log.dateFor)}
                                    >
                                        <span className="bell-item-title">{log.title || 'Untitled'}</span>
                                        <span className="bell-item-date">{log.dateFor}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}