import "./LogCard.css";

import { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import type { LogResponse } from "../../types/log/LogResponse";
import type { LogRequest } from "../../types/log/LogRequest";
import Modal from "../ui/modal/Modal";
import ReminderModal from "../ui/reminder-modal/ReminderModal";

interface LogCardProps {
    log: LogResponse | null;
    onCreate: () => void;
    onUpdate: (id: number, data: LogRequest) => void;
    onDelete: (id:number) => void;
}

export default function LogCard({ log, onCreate, onUpdate, onDelete }: LogCardProps) {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [isEditing, setIsEditing] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showReminderModal, setShowReminderModal] = useState(false);

    useEffect(() => {
        setContent(log?.content ?? '');
        setTitle(log?.title ?? '');
    }, [log]);

    if (!log) {
        return (
            <button className="add-log-btn" onClick={onCreate}>
                No log at this date, add one ?
            </button>
        );
    }

    function handleContentBlur() {
        setIsEditing(false);
        const contentChanged = content !== log!.content;
        onUpdate(log!.id, {
            title,
            content,
            dateFor: log!.dateFor,
            isDone: contentChanged ? false : log!.isDone,
            reminderFor: log!.reminderFor,
        });
    }

    function handleTitleBlur() {
        if (title !== log!.title) {
            onUpdate(log!.id, {
                title,
                content,
                dateFor: log!.dateFor,
                isDone: log!.isDone,
                reminderFor: log!.reminderFor,
            });
        }
    }

    async function handleConfirmDelete() {
        setShowDeleteModal(false);
        await onDelete(log!.id);
    }

    function formatReminderLabel(reminderFor: string | null): string {
        if (!reminderFor) return "Set Reminder";
        const [year, month, day] = reminderFor.split('-');
        return `Reminder at: ${day}/${month}/${year}`;
    }

    function handleSetReminder(date: string) {
        onUpdate(log!.id, {
            title,
            content,
            dateFor: log!.dateFor,
            isDone: log!.isDone,
            reminderFor: date,
        });
    }

    function handleClearReminder() {
        onUpdate(log!.id, {
            title,
            content,
            dateFor: log!.dateFor,
            isDone: log!.isDone,
            reminderFor: null,
        });
    }

    function handleToggleDone() {
        const newDoneState = !log!.isDone;
        onUpdate(log!.id, {
            title,
            content,
            dateFor: log!.dateFor,
            isDone: newDoneState,
            reminderFor: newDoneState ? null : log!.reminderFor,
        });
    }
    
    return (
        <>
            <div className="log-card">
                <div className="log-card-nav">
                    <div className="card-nav-left">
                        <button
                            className="reminder-btn custom-btn"
                            onClick={() => setShowReminderModal(true)}
                        >
                            {formatReminderLabel(log.reminderFor)}
                        </button>
                    </div>
                    <div className="card-nav-right">
                        <div className={`done-btn-wrapper custom-btn ${log.isDone ? 'done-btn-active' : ''}`}>
                            <button className="done-btn" onClick={handleToggleDone}>
                                <span>{log.isDone ? 'Done' : 'Mark as done'} </span>
                                <img src="/icons/check.svg" alt="check-icon" />
                            </button>
                        </div>
                        <button className="delete-btn" onClick={() => setShowDeleteModal(true)}>
                            <img src="/icons/trashcan.svg" alt="bin-icon" />
                        </button>
                    </div>
                </div>
                <div className="log-card-info">
                    <div className="card-info">
                        <input
                            className="info-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={handleTitleBlur}
                            placeholder="TITLE"
                        />
                        <div className="info-dates">
                            <span>Created: {log.createdAt}</span>
                            <span>Updated: {log.updatedAt}</span>
                        </div>
                    </div>
                    <div className="card-content">
                        {isEditing ? (
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                onBlur={handleContentBlur}
                                placeholder="Whatever content, it renders into MD file"
                            />
                        ) : (
                            <div className="markdown-view" onClick={() => setIsEditing(true)}>
                                {content ? (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {content}
                                    </ReactMarkdown>
                                ) : (
                                    <span className="markdown-placeholder">
                                        Whatever content, it renders into MD file
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showReminderModal && (
                <ReminderModal
                    currentReminder={log.reminderFor}
                    onClose={() => setShowReminderModal(false)}
                    onSetReminder={handleSetReminder}
                    onClearReminder={handleClearReminder}
                />
            )}

            {showDeleteModal && (
                <Modal
                    title="Warning"
                    onClose={() => setShowDeleteModal(false)}
                    className="delete-modal"
                >
                    <div className="delete-modal-content">
                        <span>Delete this log entry ?</span>
                        <div className="action-btn">
                            <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className="delete-btn" onClick={handleConfirmDelete}>Confirm</button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    )
}