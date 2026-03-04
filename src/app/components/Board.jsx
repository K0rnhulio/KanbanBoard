"use client";

import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import Column from "./Column";

export default function Board({ board, onDragEnd, onAddCard, onToggleDone, onCardClick, onAddColumn }) {
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="board">
                {board.columns.map((column) => (
                    <Droppable key={column.id} droppableId={column.id}>
                        {(provided, snapshot) => (
                            <Column
                                column={column}
                                provided={provided}
                                isDraggingOver={snapshot.isDraggingOver}
                                onAddCard={onAddCard}
                                onToggleDone={onToggleDone}
                                onCardClick={onCardClick}
                            />
                        )}
                    </Droppable>
                ))}

                <button className="add-column-btn" onClick={onAddColumn}>
                    <span style={{ fontSize: "1.2rem" }}>+</span>
                    <span>Add Column</span>
                </button>
            </div>
        </DragDropContext>
    );
}
