import api from './Api';
import type { Settings } from '../types/Settings';

export async function getSettings(): Promise<Settings> {
    const res = await api.get<Settings>('/settings');
    return res.data;
}

export async function updateSettings(settings: Settings): Promise<Settings> {
    const res = await api.put<Settings>('/settings', settings);
    return res.data;
}