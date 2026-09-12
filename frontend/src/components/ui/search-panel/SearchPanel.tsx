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
    const [previewLog, setPreviewLog] = useState<LogResponse | null>(null);

    useEffect(() => {
        setPreviewLog(null);

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

    function handleJumpTo() {
        if (!previewLog) return;
        onSelectLog(previewLog.dateFor);
    }

    if (query.trim().length === 0) {
        return <div className="search-panel search-panel-idle" />;
    }

    if (previewLog) {
        return (
            <div className="search-panel">
                <div className="search-preview">
                    <button className="preview-back-btn" onClick={() => setPreviewLog(null)}>
                        ← Back to results
                    </button>
                    <div className="preview-header">
                        <span className="preview-title">{previewLog.title || 'Untitled'}</span>
                        <span className="preview-date">{previewLog.dateFor}</span>
                    </div>
                    <div className="preview-content">
                        {previewLog.content || <em>No content yet.</em>}
                    </div>
                    <button className="jump-to-btn" onClick={handleJumpTo}>
                        Jump to this note
                    </button>
                </div>
            </div>
        );
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
                        onClick={() => setPreviewLog(log)}
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