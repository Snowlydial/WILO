import { useState, useEffect } from "react";

import type { LogResponse } from './types/log/LogResponse';
import type { LogRequest } from "./types/log/LogRequest";
import type { LogStatus } from "./types/log/LogStatus";

import LogCard from "./components/log/LogCard";
import DateSelector from "./components/ui/date-selector/DateSelector";
import SearchNav from "./components/ui/search-nav/SearchNav";
import SearchPanel from "./components/ui/search-panel/SearchPanel";
import SettingsModal from "./components/setting/SettingsModal";

import { formatDateForApi, getWeekDates } from './utils/DateUtil';
import { getLogByDate, createLog, updateLog, deleteLog, getStatusRange, getDueReminders } from './services/LogService';
import { getSettings } from './services/SettingsService';

import './App.css';

const notifiedReminderIds = new Set<number>();

function App() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentLog, setCurrentLog] = useState<LogResponse | null>(null);
    const [query, setQuery] = useState('');
    const [statuses, setStatuses] = useState<Map<string, LogStatus>>(new Map());
    const [dueReminders, setDueReminders] = useState<LogResponse[]>([]);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        const dateStr = formatDateForApi(selectedDate);
        getLogByDate(dateStr).then(setCurrentLog);
    }, [selectedDate]);

    async function refreshStatuses(forDate: Date) {
        const weekDates = getWeekDates(forDate);
        const start = formatDateForApi(weekDates[0]);
        const end = formatDateForApi(weekDates[6]);
        console.log('Refreshing statuses for range:', start, 'to', end);
        const results = await getStatusRange(start, end);
        console.log('Got statuses:', results);
        setStatuses(new Map(results.map((s) => [s.dateFor, s])));
    }

    useEffect(() => {
        refreshStatuses(selectedDate);
    }, [selectedDate]);

    async function handleCreateLog() {
        const dateStr = formatDateForApi(selectedDate);
        const newLog = await createLog({ title: '', content: '', dateFor: dateStr, isDone: false, reminderFor: null });
        setCurrentLog(newLog);
    }

    async function handleUpdateLog(id: number, data: LogRequest) {
        const updated = await updateLog(id, data);
        setCurrentLog(updated);
        await refreshStatuses(selectedDate);
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

    function fireGroupedReminderNotification(logs: LogResponse[]) {
        const titles = logs.map((log) => log.title || 'Untitled').join(', ');
        const notification = new Notification('WILO Reminders', {
            body: logs.length === 1
                ? (logs[0].title || 'You have a log to revisit')
                : `${logs.length} logs need attention: ${titles}`,
        });
        notification.onclick = () => {
            window.focus();
        };
    }

    useEffect(() => {
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }

        async function checkReminders() {
            const settings = await getSettings();
            if (!settings.reminderState) return;

            const now = new Date();
            const [notifyHour, notifyMinute] = (settings.notifyTimeOfDay ?? '09:00:00').split(':').map(Number);
            const isPastNotifyTime =
                now.getHours() > notifyHour ||
                (now.getHours() === notifyHour && now.getMinutes() >= notifyMinute);

            const due = await getDueReminders();
            setDueReminders(due); // bell badge/dropdown stays live regardless of notify time

            if (!isPastNotifyTime) return; // don't fire the OS notification yet

            const newlyDue = due.filter((log) => !notifiedReminderIds.has(log.id));
            if (newlyDue.length > 0 && Notification.permission === 'granted') {
                fireGroupedReminderNotification(newlyDue);
                newlyDue.forEach((log) => notifiedReminderIds.add(log.id));
            }
        }

        checkReminders();
        const interval = setInterval(checkReminders, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="app-layout">
            <div className="app-left">
                <SearchNav
                    query={query}
                    onQueryChange={setQuery}
                    dueReminders={dueReminders}
                    onSelectReminder={handleSelectSearchResult}
                    onLogoClick={() => setShowSettings(true)}
                />
                <DateSelector
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                    statuses={statuses}
                    onWeekChange={refreshStatuses}
                />
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
            {showSettings && (
                <SettingsModal onClose={() => setShowSettings(false)} />
            )}
        </div>
    )
}

export default App