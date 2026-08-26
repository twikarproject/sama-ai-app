# Sama.ai — full-stack prototype

React + Vite client, Node + Express + Socket.IO server. Client connects at `VITE_SERVER_URL` (defaults to `http://localhost:4000`).

## Run both

```
cd server && npm install && npm run dev
```
```
cd .. && npm install && npm run dev
```

Open the client URL in two browser tabs — clap, vote a poll, or ask a question in one and watch it update live in the other. That's the whole point of the backend: state lives on the server and broadcasts to every connected client over Socket.IO.

## What's real

- **Transport** — real WebSocket connection (Socket.IO), not polling or a mock.
- **Real-time**: transcript (auto-advancing canned multilingual script, every 6s), applause/energy, poll votes, Q&A upvotes/new questions, participant presence and mute state.
- **Multi-client** — genuinely multi-user. Each browser tab/device is its own socket connection; the server is the single source of truth.

## What's mocked / not implemented

- **Translation is canned**, not a real ASR/MT pipeline — `server/index.js`'s `TRANSCRIPT_SCRIPT` cycles fixed English/Hindi/Spanish lines. Swap `nextTranscriptLine()` for a real speech-to-text + translation call when ready; the broadcast shape (`{id, t, who, en, lines}`) is designed to stay the same.
- **No persistence** — everything resets when the server restarts. Add SQLite/Postgres behind the same event handlers if you need it to survive restarts.
- **No auth** — Login is name + room code, no password, no session token.
- **One hardcoded room** — every client joins the same in-memory room; no multi-room routing yet.
- **Client screens** — Login, Pre-join and Live Translation are fully wired to the server. The other 7 screens (Applause, Activity, Q&A, Speaker Cockpit, Engagement Studio, Question Digest, Host Control Room, Recap) are still stubs — the server already emits everything they need (`poll:update`, `qa:update`, `presence:update`); wiring them up is mostly UI work reading `useRoom()`.

See `server/README.md` for the event list and `src/state/store.tsx` for how the client subscribes.
