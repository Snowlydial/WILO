import { useState } from 'react';
import Modal from '../modal/Modal';
import { searchLogs } from '../../../services/LogService';
import type { LogResponse } from '../../../types/log/LogResponse';
import './SearchModal.css';

interface SearchModalProps {
    onClose: () => void;
    onSelectLog: (date: string) => void;
}

function truncate(text: string, max: number = 80): string {
    if (!text) return '';
    return text.length > max ? text.slice(0, max) + '...' : text;
}

export default function SearchModal({ onClose, onSelectLog }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<LogResponse[]>([]);
    const [selectedLog, setSelectedLog] = useState<LogResponse | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    async function handleSearch(value: string) {
        setQuery(value);
        if (value.trim().length === 0) {
            setResults([]);
            setSelectedLog(null);
            return;
        }
        setIsSearching(true);
        const found = await searchLogs(value);
        setResults(found);
        setIsSearching(false);
    }

    function handleJumpTo() {
        if (!selectedLog) return;
        onSelectLog(selectedLog.dateFor);
        onClose();
    }

    return (
        <Modal title="Search Notes" onClose={onClose} className="search-modal">
            <div className="search-modal-body">
                <div className="search-modal-left">
                    <input
                        className="search-modal-input"
                        type="text"
                        autoFocus
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search title or content..."
                    />

                    <div className="search-results">
                        {isSearching && <span className="search-status">Searching...</span>}

                        {!isSearching && query && results.length === 0 && (
                            <span className="search-status">No notes found.</span>
                        )}

                        {results.map((log) => (
                            <div
                                key={log.id}
                                className={`search-result-card ${selectedLog?.id === log.id ? 'search-result-card-active' : ''}`}
                                onClick={() => setSelectedLog(log)}
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

                {selectedLog && (
                    <div className="search-preview-card">
                        <div className="preview-card-header">
                            <span className="preview-card-title">{selectedLog.title || 'Untitled'}</span>
                            <span className="preview-card-date">{selectedLog.dateFor}</span>
                        </div>
                        <div className="preview-card-content">
                            {selectedLog.content || <em>No content yet.</em>}
                        </div>
                        <button className="jump-to-btn" onClick={handleJumpTo}>
                            Jump to this note
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    );
}