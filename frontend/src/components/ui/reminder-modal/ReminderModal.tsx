import { useState } from 'react';
import Modal from '../modal/Modal';
import { formatDateForApi } from '../../../utils/DateUtil';
import './ReminderModal.css';

interface ReminderModalProps {
    currentReminder: string | null;
    onClose: () => void;
    onSetReminder: (date: string) => void;
    onClearReminder: () => void;
}

export default function ReminderModal({ currentReminder, onClose, onSetReminder, onClearReminder }: ReminderModalProps) {
    const initial = currentReminder ? currentReminder : formatDateForApi(new Date());
    const [selectedDate, setSelectedDate] = useState(initial);

    function handleSave() {
        onSetReminder(selectedDate);
        onClose();
    }

    function handleClear() {
        onClearReminder();
        onClose();
    }

    return (
        <Modal title="Set Reminder" onClose={onClose} className="reminder-modal">
            <div className="reminder-modal-content">
                <label className="reminder-label">Remind me on:</label>
                <input
                    type="date"
                    className="reminder-date-input"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
                <div className="reminder-actions">
                    {currentReminder && (
                        <button className="reminder-clear-btn" onClick={handleClear}>
                            Clear Reminder
                        </button>
                    )}
                    <button className="reminder-save-btn" onClick={handleSave}>
                        Save
                    </button>
                </div>
            </div>
        </Modal>
    );
}