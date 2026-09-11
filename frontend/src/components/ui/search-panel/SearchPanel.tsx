import { useEffect, useState } from 'react';
import { searchLogs } from '../../../services/LogService';
import type { LogResponse } from '../../../types/log/LogResponse';
import './SearchPanel.css';

interface SearchPanelProps {
    query: string;
    onSelectLog: (date: string) => void;
}

function truncate(text: string, max: number = 100): string {
    if (!text) return '';
    return text.length > max ? text.slice(0, max) + '...' : text;
}

export default function SearchPanel({ query, onSelectLog }: SearchPanelProps) {
    const [results, setResults] = useState<LogResponse[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (query.trim().length === 0) {
            setResults([]);
            return;
        }
        setIsSearching(true);

        const timeout = setTimeout(() => {
            searchLogs(query).then((found) => {
                setResults(found);
                setIsSearching(false);
            });
        }, 300);
        return () => clearTimeout(timeout);
    }, [query]);

    if (query.trim().length === 0) {
        return <div className="search-panel search-panel-idle" />;
    }

    return (
        <div className="search-panel">
            {isSearching && <span className="search-status">Searching...</span>}
            {!isSearching && results.length === 0 && (
                <span className="search-status">No notes found.</span>
            )}
            <div className="search-results">
                {results.map((log) => (
                    <div
                        key={log.id}
                        className="search-result-card"
                        onClick={() => onSelectLog(log.dateFor)}
                    >
                        <div className="result-card-header">
                            <span className="result-card-title">{log.title || 'Untitled'}</span>
                            <span className="result-card-date">{log.dateFor}</span>
                        </div>
                        <p className="result-card-preview">{truncate(log.content)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}