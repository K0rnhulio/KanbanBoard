import { v4 as uuidv4 } from "uuid";

export function getDefaultBoard() {
    return {
        columns: [
            {
                id: "col-todo",
                title: "To Do",
                color: "#6366f1",
                cards: [
                    {
                        id: uuidv4(),
                        title: "Welcome to the Kanban Board!",
                        notes: "Drag cards between columns, add new tasks, and click cards to edit them. Your data is saved automatically.",
                        done: false,
                        createdAt: new Date().toISOString(),
                    },
                ],
            },
            {
                id: "col-progress",
                title: "In Progress",
                color: "#f59e0b",
                cards: [],
            },
            {
                id: "col-done",
                title: "Done",
                color: "#10b981",
                cards: [],
            },
        ],
    };
}
