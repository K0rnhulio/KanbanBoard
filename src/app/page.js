"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Board from "./components/Board";
import CardModal from "./components/CardModal";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
    const [board, setBoard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editingCard, setEditingCard] = useState(null); // { columnId, card }
    const [savingTimeout, setSavingTimeout] = useState(null);
    const boardRef = useRef(null);

    /* ------- Load board on mount ------- */
    useEffect(() => {
        fetch("/api/board")
            .then((res) => res.json())
            .then((data) => {
                setBoard(data);
                boardRef.current = data;
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    /* ------- Debounced save ------- */
    const saveBoard = useCallback(
        (newBoard) => {
            boardRef.current = newBoard;
            setBoard(newBoard);

            if (savingTimeout) clearTimeout(savingTimeout);
            const t = setTimeout(() => {
                fetch("/api/board", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newBoard),
                }).catch(console.error);
            }, 400);
            setSavingTimeout(t);
        },
        [savingTimeout]
    );

    /* ------- Card operations ------- */
    const addCard = useCallback(
        (columnId, title) => {
            const newCard = {
                id: uuidv4(),
                title,
                notes: "",
                done: false,
                createdAt: new Date().toISOString(),
            };
            const newBoard = {
                ...boardRef.current,
                columns: boardRef.current.columns.map((col) =>
                    col.id === columnId
                        ? { ...col, cards: [...col.cards, newCard] }
                        : col
                ),
            };
            saveBoard(newBoard);
        },
        [saveBoard]
    );

    const toggleDone = useCallback(
        (columnId, cardId) => {
            const newBoard = {
                ...boardRef.current,
                columns: boardRef.current.columns.map((col) =>
                    col.id === columnId
                        ? {
                            ...col,
                            cards: col.cards.map((c) =>
                                c.id === cardId ? { ...c, done: !c.done } : c
                            ),
                        }
                        : col
                ),
            };
            saveBoard(newBoard);
        },
        [saveBoard]
    );

    const updateCard = useCallback(
        (columnId, cardId, updates) => {
            const newBoard = {
                ...boardRef.current,
                columns: boardRef.current.columns.map((col) =>
                    col.id === columnId
                        ? {
                            ...col,
                            cards: col.cards.map((c) =>
                                c.id === cardId ? { ...c, ...updates } : c
                            ),
                        }
                        : col
                ),
            };
            saveBoard(newBoard);
            setEditingCard(null);
        },
        [saveBoard]
    );

    const deleteCard = useCallback(
        (columnId, cardId) => {
            const newBoard = {
                ...boardRef.current,
                columns: boardRef.current.columns.map((col) =>
                    col.id === columnId
                        ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
                        : col
                ),
            };
            saveBoard(newBoard);
            setEditingCard(null);
        },
        [saveBoard]
    );

    /* ------- Column operations ------- */
    const addColumn = useCallback(() => {
        const name = prompt("Column name:");
        if (!name?.trim()) return;
        const colors = ["#6366f1", "#f59e0b", "#10b981", "#f43f5e", "#06b6d4", "#8b5cf6", "#ec4899"];
        const newBoard = {
            ...boardRef.current,
            columns: [
                ...boardRef.current.columns,
                {
                    id: `col-${uuidv4().slice(0, 8)}`,
                    title: name.trim(),
                    color: colors[boardRef.current.columns.length % colors.length],
                    cards: [],
                },
            ],
        };
        saveBoard(newBoard);
    }, [saveBoard]);

    /* ------- Drag & Drop ------- */
    const onDragEnd = useCallback(
        (result) => {
            const { source, destination } = result;
            if (!destination) return;
            if (
                source.droppableId === destination.droppableId &&
                source.index === destination.index
            )
                return;

            const cols = [...boardRef.current.columns];
            const srcCol = cols.find((c) => c.id === source.droppableId);
            const dstCol = cols.find((c) => c.id === destination.droppableId);

            const srcCards = [...srcCol.cards];
            const [moved] = srcCards.splice(source.index, 1);

            if (source.droppableId === destination.droppableId) {
                srcCards.splice(destination.index, 0, moved);
                srcCol.cards = srcCards;
            } else {
                const dstCards = [...dstCol.cards];
                dstCards.splice(destination.index, 0, moved);
                srcCol.cards = srcCards;
                dstCol.cards = dstCards;
            }

            const newBoard = { ...boardRef.current, columns: cols };
            saveBoard(newBoard);
        },
        [saveBoard]
    );

    /* ------- Render ------- */
    if (loading) {
        return (
            <div className="loading">
                <div className="loading__spinner" />
                <div className="loading__text">Loading board…</div>
            </div>
        );
    }

    return (
        <>
            <header className="header">
                <div>
                    <h1 className="header__title">Candora Team Board</h1>
                    <p className="header__subtitle">Team workspace</p>
                </div>
                <div className="header__status">
                    <span className="header__dot" />
                    <span>Auto-saving</span>
                </div>
            </header>

            {board && (
                <Board
                    board={board}
                    onDragEnd={onDragEnd}
                    onAddCard={addCard}
                    onToggleDone={toggleDone}
                    onCardClick={(columnId, card) => setEditingCard({ columnId, card })}
                    onAddColumn={addColumn}
                />
            )}

            {editingCard && (
                <CardModal
                    card={editingCard.card}
                    onSave={(updates) =>
                        updateCard(editingCard.columnId, editingCard.card.id, updates)
                    }
                    onDelete={() =>
                        deleteCard(editingCard.columnId, editingCard.card.id)
                    }
                    onClose={() => setEditingCard(null)}
                />
            )}
        </>
    );
}
