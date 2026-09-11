import { useState, useEffect } from "react";

import LogCard from "./components/log/LogCard"
import DateSelector from "./components/ui/date-selector/DateSelector"
import SearchNav from "./components/ui/search-nav/SearchNav"
import type { LogResponse } from './types/log/LogResponse';
import { formatDateForApi } from './utils/DateUtil';
import { getLogByDate, createLog } from './services/Logs';

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

    return (
        <>
            <SearchNav></SearchNav>
            <DateSelector
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
            />
            <LogCard log={currentLog} onCreate={handleCreateLog} />
        </>
    )
}

export default App
