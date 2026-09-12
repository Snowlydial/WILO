import api from './Api';
import type { LogResponse } from '../types/log/LogResponse';
import type { LogRequest } from '../types/log/LogRequest';
import type { LogStatus } from '../types/log/LogStatus';

export async function getLogByDate(date: string): Promise<LogResponse | null> {
    try {
        const res = await api.get<LogResponse>(`/logs/date/${date}`);
        return res.data;
    } catch (err: any) {
        if (err.response?.status === 404) {
            return null;
        }
        throw err;
    }
}

export async function searchLogs(query: string): Promise<LogResponse[]> {
    const res = await api.get<LogResponse[]>('/logs/search', { params: { q: query } });
    return res.data;
}

export async function createLog(logData: LogRequest): Promise<LogResponse> {
    const res = await api.post<LogResponse>('/logs', logData);
    return res.data;
}

export async function updateLog(id:number, logData: LogRequest): Promise<LogResponse> {
    const res = await api.put<LogResponse>(`/logs/${id}`, logData);
    return res.data;
}

export async function deleteLog(id:number): Promise<LogResponse> {
    const res = await api.delete<LogResponse>(`/logs/${id}`);
    return res.data;
}

export async function getDueReminders(): Promise<LogResponse[]> {
    const res = await api.get<LogResponse[]>('/logs/reminders/due');
    return res.data;
}

export async function getStatusRange(start: string, end: string): Promise<LogStatus[]> {
    const res = await api.get<LogStatus[]>('/logs/status', { params: { start, end } });
    return res.data;
}