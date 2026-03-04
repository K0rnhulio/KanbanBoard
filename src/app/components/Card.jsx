"use client";

/* Render text with clickable URLs */
function Linkify({ text }) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, i) =>
        urlRegex.test(part) ? (
            <a
                key={i}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="card__link"
                onClick={(e) => e.stopPropagation()}
            >
                {part.length > 40 ? part.slice(0, 40) + "…" : part}
            </a>
        ) : (
            <span key={i}>{part}</span>
        )
    );
}

const AVATAR_COLORS = {
    H: "#6366f1",
    V: "#f59e0b",
    D: "#10b981",
    S: "#ec4899",
};

function getAssigneeList(card) {
    if (Array.isArray(card.assignees) && card.assignees.length > 0) return card.assignees;
    if (card.assignee) return [card.assignee];
    return [];
}

export default function Card({ card, provided, isDragging, onToggleDone, onClick }) {
    const dateStr = card.createdAt
        ? new Date(card.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        })
        : "";

    const assignees = getAssigneeList(card);

    return (
        <div
            className={`card${isDragging ? " card--dragging" : ""}${card.done ? " card--done" : ""}`}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={(e) => {
                if (e.target.classList.contains("card__checkbox")) return;
                if (e.target.closest(".card__link")) return;
                onClick();
            }}
        >
            <div className="card__top-row">
                <input
                    type="checkbox"
                    className="card__checkbox"
                    checked={card.done}
                    onChange={(e) => {
                        e.stopPropagation();
                        onToggleDone();
                    }}
                />
                <span className="card__title">{card.title}</span>
            </div>

            {card.notes && (
                <p className="card__notes-preview">
                    <Linkify text={card.notes} />
                </p>
            )}

            <div className="card__meta">
                {assignees.map((name) => (
                    <span
                        key={name}
                        className="card__assignee-badge"
                        style={{
                            background: AVATAR_COLORS[name[0]] || "#6366f1",
                        }}
                    >
                        {name}
                    </span>
                ))}
                {assignees.length > 0 && <span>·</span>}
                {dateStr && <span>{dateStr}</span>}
                {card.notes && (
                    <>
                        <span>·</span>
                        <span>📝</span>
                    </>
                )}
            </div>
        </div>
    );
}
