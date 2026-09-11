import { useState, useEffect } from "react";

import type { LogResponse } from './types/log/LogResponse';
import type { LogRequest } from "./types/log/LogRequest";

import LogCard from "./components/log/LogCard";
import DateSelector from "./components/ui/date-selector/DateSelector";
import SearchNav from "./components/ui/search-nav/SearchNav";
import SearchPanel from "./components/ui/search-panel/SearchPanel";
import { formatDateForApi } from './utils/DateUtil';
import { getLogByDate, createLog, updateLog, deleteLog } from './services/LogService';
import './App.css';

function App() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentLog, setCurrentLog] = useState<LogResponse | null>(null);
    const [query, setQuery] = useState('');

    useEffect(() => {
        const dateStr = formatDateForApi(selectedDate);
        getLogByDate(dateStr).then(setCurrentLog);
    }, [selectedDate]);

    async function handleCreateLog() {
        const dateStr = formatDateForApi(selectedDate);
        const newLog = await createLog({ title: '', content: '', dateFor: dateStr, isDone: false, reminderFor: null });
        setCurrentLog(newLog);
    }

    async function handleUpdateLog(id: number, data: LogRequest) {
        const updated = await updateLog(id, data);
        setCurrentLog(updated);
    }

    async function handleDeleteLog(id: number) {
        await deleteLog(id);
        setCurrentLog(null);
    }

    function handleSelectSearchResult(dateStr: string) {
        const [year, month, day] = dateStr.split('-').map(Number);
        setSelectedDate(new Date(year, month - 1, day));
        setQuery('');
    }

    return (
        <div className="app-layout">
            <div className="app-left">
                <SearchNav query={query} onQueryChange={setQuery} />
                <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />
                <SearchPanel query={query} onSelectLog={handleSelectSearchResult} />
            </div>
            <div className="app-right">
                <LogCard
                    log={currentLog}
                    onCreate={handleCreateLog}
                    onUpdate={handleUpdateLog}
                    onDelete={handleDeleteLog}
                />
            </div>
        </div>
    )
}

export default App