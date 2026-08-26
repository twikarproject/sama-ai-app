# Sama.ai — mock real-time server

Node + Express + Socket.IO. Single in-memory demo room; state resets on restart.

## Run

```
cd server
npm install
npm run dev
```

Listens on `:4000`. `GET /health` for a liveness check.

## What's real-time

Broadcast to every connected client via Socket.IO:

- **Transcript** — a canned multilingual script (English + Hindi + Spanish per line) auto-advances every 6s (`transcript:line`), simulating a live translation feed. Swap `nextTranscriptLine` for a real ASR/translation call when ready.
- **Applause** — `clap` in, `clap:update` (claps + energy) out to everyone.
- **Polls** — `poll:vote` in, `poll:update` out.
- **Q&A** — `qa:ask` / `qa:upvote` in, `qa:update` out.
- **Presence** — participants list broadcasts on join/leave/mute (`presence:update`).

Open the client in two tabs to see claps, polls and presence sync live between them.

## Not implemented

Persistence (everything is in-memory), auth, real translation/ASR, multiple concurrent rooms (one hardcoded room for the whole server), host-only permission checks on mute/moderation events.
