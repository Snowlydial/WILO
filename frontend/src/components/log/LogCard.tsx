import "./LogCard.css";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { LogResponse } from "../../types/log/LogResponse";
import type { LogRequest } from "../../types/log/LogRequest";

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

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    }, [content, isEditing]);

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
        onUpdate(log!.id, {
            title,
            content,
            dateFor: log!.dateFor,
            isDone: log!.isDone,
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
    
    return (
        <div className="log-card">
            <div className="log-card-nav">
                <div className="card-nav-left">
                    <button className="reminder-btn custom-btn">Set Reminder</button>
                </div>
                <div className="card-nav-right">
                    <div className="done-btn-wrapper custom-btn">
                        <button className="done-btn">
                            <span>Mark as done </span>
                            <img src="/icons/check.svg" alt="check-icon" />
                        </button>
                    </div>
                    <button className="delete-btn" onClick={() => onDelete(log.id)}>
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
                            ref={textareaRef}
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
    )
}