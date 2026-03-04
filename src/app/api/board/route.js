import { NextResponse } from "next/server";
import { getDefaultBoard } from "./defaults";

/* ------------------------------------------------------------------ */
/*  In-memory fallback when Vercel KV is not configured (local dev)   */
/* ------------------------------------------------------------------ */
let memoryStore = null;

async function getKv() {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        const { kv } = await import("@vercel/kv");
        return kv;
    }
    return null;
}

async function loadBoard() {
    const kv = await getKv();
    if (kv) {
        const data = await kv.get("kanban:board");
        return data || getDefaultBoard();
    }
    // Fallback: in-memory
    if (!memoryStore) memoryStore = getDefaultBoard();
    return memoryStore;
}

async function saveBoard(board) {
    const kv = await getKv();
    if (kv) {
        await kv.set("kanban:board", board);
    } else {
        memoryStore = board;
    }
}

/* ------------------------------------------------------------------ */
/*  GET /api/board — return the current board state                   */
/* ------------------------------------------------------------------ */
export async function GET() {
    try {
        const board = await loadBoard();
        return NextResponse.json(board);
    } catch (err) {
        console.error("GET /api/board error:", err);
        return NextResponse.json(getDefaultBoard());
    }
}

/* ------------------------------------------------------------------ */
/*  PUT /api/board — save the full board state                        */
/* ------------------------------------------------------------------ */
export async function PUT(request) {
    try {
        const board = await request.json();
        await saveBoard(board);
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("PUT /api/board error:", err);
        return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
}
