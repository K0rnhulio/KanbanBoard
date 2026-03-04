"use client";

import { useState, useRef, useEffect } from "react";

export default function AddCardForm({ onSubmit, onCancel }) {
    const [title, setTitle] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSubmit(title.trim());
        setTitle("");
    };

    return (
        <form className="add-card-form" onSubmit={handleSubmit}>
            <input
                ref={inputRef}
                className="add-card-form__input"
                type="text"
                placeholder="Enter a title…"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Escape") onCancel();
                }}
            />
            <div className="add-card-form__actions">
                <button type="submit" className="add-card-form__submit">
                    Add card
                </button>
                <button
                    type="button"
                    className="add-card-form__cancel"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
