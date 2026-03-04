"use client";

import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import Card from "./Card";
import AddCardForm from "./AddCardForm";

export default function Column({ column, provided, isDraggingOver, onAddCard, onToggleDone, onCardClick }) {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="column">
            <div className="column__header">
                <div className="column__title-group">
                    <div
                        className="column__indicator"
                        style={{ background: column.color }}
                    />
                    <span className="column__title">{column.title}</span>
                </div>
                <span className="column__count">{column.cards.length}</span>
            </div>

            <div
                className={`column__cards${isDraggingOver ? " column__cards--dragging-over" : ""}`}
                ref={provided.innerRef}
                {...provided.droppableProps}
            >
                {column.cards.map((card, index) => (
                    <Draggable key={card.id} draggableId={card.id} index={index}>
                        {(dragProvided, dragSnapshot) => (
                            <Card
                                card={card}
                                provided={dragProvided}
                                isDragging={dragSnapshot.isDragging}
                                onToggleDone={() => onToggleDone(column.id, card.id)}
                                onClick={() => onCardClick(column.id, card)}
                            />
                        )}
                    </Draggable>
                ))}
                {provided.placeholder}
            </div>

            {showForm ? (
                <AddCardForm
                    onSubmit={(title) => {
                        onAddCard(column.id, title);
                        setShowForm(false);
                    }}
                    onCancel={() => setShowForm(false)}
                />
            ) : (
                <button className="add-card-btn" onClick={() => setShowForm(true)}>
                    <span className="add-card-btn__icon">+</span>
                    <span>Add card</span>
                </button>
            )}
        </div>
    );
}
