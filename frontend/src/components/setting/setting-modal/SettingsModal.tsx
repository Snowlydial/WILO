import { useState, useEffect } from 'react';
import Modal from '../../ui/modal/Modal';
import MonthlyRecap from '../monthly-recap/MonthlyRecap';
import { getSettings, updateSettings } from '../../../services/SettingsService';
import type { Settings } from '../../../types/Settings';
import { setAlwaysOnTop } from '../../../services/WailsBridge';
import './SettingsModal.css';

interface SettingsModalProps {
    onClose: () => void;
    onSelectDay: (date: string) => void;
}

type Tab = 'settings' | 'recap';

export default function SettingsModal({ onClose, onSelectDay }: SettingsModalProps) {
    const [activeTab, setActiveTab] = useState<Tab>('settings');
    const [settings, setSettings] = useState<Settings | null>(null);

    useEffect(() => {
        getSettings().then(setSettings);
    }, []);

    function handleChange(field: keyof Settings, value: boolean | string) {
        if (!settings) return;
        const updated = { ...settings, [field]: value };
        setSettings(updated);
        updateSettings(updated);

        if (field === 'displayOver') {
            setAlwaysOnTop(value as boolean);
        }
    }

    function handleSelectDay(dateStr: string) {
        onSelectDay(dateStr);
        onClose();
    }

    return (
        <Modal title="Settings" onClose={onClose} className="settings-modal">
            <div className="settings-modal-body">
                <div className="settings-nav">
                    <button
                        className={`settings-nav-item ${activeTab === 'settings' ? 'settings-nav-active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        Settings
                    </button>
                    <button
                        className={`settings-nav-item ${activeTab === 'recap' ? 'settings-nav-active' : ''}`}
                        onClick={() => setActiveTab('recap')}
                    >
                        Monthly Recap
                    </button>
                </div>

                <div className="settings-content">
                    {activeTab === 'settings' && settings && (
                        <div className="settings-form">
                            <label className="settings-row">
                                <span>Enable reminders</span>
                                <input
                                    type="checkbox"
                                    checked={settings.reminderState}
                                    onChange={(e) => handleChange('reminderState', e.target.checked)}
                                />
                            </label>

                            <label className="settings-row">
                                <span>Notify me at</span>
                                <input
                                    type="time"
                                    value={settings.notifyTimeOfDay?.slice(0, 5) ?? '09:00'}
                                    onChange={(e) => handleChange('notifyTimeOfDay', e.target.value + ':00')}
                                />
                            </label>

                            <label className="settings-row">
                                <span>Always on top</span>
                                <input
                                    type="checkbox"
                                    checked={settings.displayOver}
                                    onChange={(e) => handleChange('displayOver', e.target.checked)}
                                />
                            </label>

                            <label className="settings-row">
                                <span>Launch on startup</span>
                                <input
                                    type="checkbox"
                                    checked={settings.autostart}
                                    onChange={(e) => handleChange('autostart', e.target.checked)}
                                />
                            </label>
                        </div>
                    )}

                    {activeTab === 'recap' && (
                        <MonthlyRecap onSelectDay={handleSelectDay} />
                    )}
                </div>
            </div>
        </Modal>
    );
}