import { useState, useEffect } from "react";

import type { LogResponse } from './types/log/LogResponse';
import type { LogRequest } from "./types/log/LogRequest";

import LogCard from "./components/log/LogCard";
import DateSelector from "./components/ui/date-selector/DateSelector";
import SearchNav from "./components/ui/search-nav/SearchNav";
import SearchModal from "./components/ui/search-modal/SearchModal";
import { formatDateForApi } from './utils/DateUtil';
import { getLogByDate, createLog, updateLog, deleteLog } from './services/LogService';

function App() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentLog, setCurrentLog] = useState<LogResponse | null>(null);
    useEffect(() => {
        const dateStr = formatDateForApi(selectedDate);
        getLogByDate(dateStr).then(setCurrentLog);
    }, [selectedDate]);

    async function handleCreateLog() {
        const dateStr = formatDateForApi(selectedDate);
        const newLog = await createLog({
            title: '',
            content: '',
            dateFor: dateStr,
            isDone: false,
            reminderFor: null,
        });
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

    const [showSearch, setShowSearch] = useState(false);
    function handleSelectSearchResult(dateStr: string) {
        const [year, month, day] = dateStr.split('-').map(Number);
        setSelectedDate(new Date(year, month - 1, day));
    }

    return (
        <>
            <SearchNav onSearchClick={() => setShowSearch(true)} />
            <DateSelector
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
            />
            <LogCard 
                log={currentLog} 
                onCreate={handleCreateLog}
                onUpdate={handleUpdateLog}
                onDelete={handleDeleteLog} 
            />

            {showSearch && (
                <SearchModal
                    onClose={() => setShowSearch(false)}
                    onSelectLog={handleSelectSearchResult}
                />
            )}
        </>
    )
}

export default App
