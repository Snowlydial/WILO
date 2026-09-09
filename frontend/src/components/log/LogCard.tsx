import "./LogCard.css";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function LogCard() {
    const [content, setContent] = useState('');
    const [isEditing, setIsEditing] = useState(true);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    }, [content, isEditing]);

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
                    <button className="delete-btn">
                        <img src="/icons/trashcan.svg" alt="bin-icon" />
                    </button>
                </div>
            </div>
            <div className="log-card-info">
                <div className="card-info">
                    <span className="info-title">TITLE</span>
                    <div className="info-dates">
                        <span>Created: dd/mm/yyyy at hh:mm</span>
                        <span>Updated: dd/mm/yyyy at hh:mm</span>
                    </div>
                </div>
                <div className="card-content">
                    {isEditing ? (
                        <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onBlur={() => setIsEditing(false)}
                            placeholder="Whatever content, text field, insert list in there..."
                        />
                    ) : (
                        <div onClick={() => setIsEditing(true)}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {content}
                        </ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}