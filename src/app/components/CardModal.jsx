"use client";

import { useState, useEffect, useRef } from "react";

const TEAM_MEMBERS = ["Hien", "Vy", "Diem", "Sep"];

export default function CardModal({ card, onSave, onDelete, onClose }) {
    const [title, setTitle] = useState(card.title);
    const [notes, setNotes] = useState(card.notes || "");
    const [assignees, setAssignees] = useState(
        Array.isArray(card.assignees)
            ? card.assignees
            : card.assignee
                ? [card.assignee]
                : []
    );
    const titleRef = useRef(null);

    useEffect(() => {
        titleRef.current?.focus();
        titleRef.current?.select();

        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    const toggleAssignee = (member) => {
        setAssignees((prev) =>
            prev.includes(member)
                ? prev.filter((m) => m !== member)
                : [...prev, member]
        );
    };

    const handleSave = () => {
        if (!title.trim()) return;
        onSave({ title: title.trim(), notes, assignees });
    };

    const handleDelete = () => {
        if (confirm("Delete this card?")) {
            onDelete();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal__header">
                    <span
                        style={{
                            fontSize: "0.7rem",
                            color: "var(--text-muted)",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            fontWeight: 600,
                        }}
                    >
                        Edit Card
                    </span>
                    <button className="modal__close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="modal__body">
                    <div>
                        <label className="modal__label" htmlFor="card-title">
                            Title
                        </label>
                        <input
                            ref={titleRef}
                            id="card-title"
                            className="modal__input"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSave();
                            }}
                        />
                    </div>

                    <div>
                        <label className="modal__label">Assign to</label>
                        <div className="assignee-picker">
                            {TEAM_MEMBERS.map((member) => (
                                <button
                                    key={member}
                                    type="button"
                                    className={`assignee-picker__btn${assignees.includes(member) ? " assignee-picker__btn--active" : ""}`}
                                    onClick={() => toggleAssignee(member)}
                                >
                                    <span className="assignee-picker__avatar">
                                        {member[0]}
                                    </span>
                                    <span>{member}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="modal__label" htmlFor="card-notes">
                            Notes
                        </label>
                        <textarea
                            id="card-notes"
                            className="modal__textarea"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add details, context, or links…"
                        />
                    </div>
                </div>

                <div className="modal__footer">
                    <button className="modal__delete" onClick={handleDelete}>
                        🗑 Delete card
                    </button>
                    <button className="modal__save" onClick={handleSave}>
                        Save changes
                    </button>
                </div>
            </div>
        </div>
    );
}
