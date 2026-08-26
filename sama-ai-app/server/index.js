import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
app.use(cors());
app.use(express.json());
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

const PORT = process.env.PORT || 4000;

// --- in-memory room state (single demo room; resets on restart) ---------

const TRANSCRIPT_SCRIPT = [
  { who: 'Lukas Weber', en: 'Pipeline in Europe is ahead of plan, but deal cycles stretched two weeks.',
    lines: { 'हिन्दी': 'यूरोप में पाइपलाइन उम्मीद से बेहतर है, लेकिन डील साइकल दो हफ़्ते लंबे हो गए हैं।',
             'Español': 'El pipeline en Europa va mejor de lo esperado, pero los ciclos de venta se alargaron dos semanas.' } },
  { who: 'Sofía Ramírez', en: 'We closed three enterprise accounts in LATAM, all partner-sourced.',
    lines: { 'हिन्दी': 'लैटिन अमेरिका में हमने तीन एंटरप्राइज़ अकाउंट बंद किए — तीनों पार्टनर के ज़रिए आए।',
             'Español': 'Cerramos tres cuentas empresariales en LATAM, todas a través de partners.' } },
  { who: 'Amara Okafor', en: 'This quarter we grew ARR thirty percent, to forty-two million dollars.',
    lines: { 'हिन्दी': 'इस तिमाही में हमने ARR तीस प्रतिशत बढ़ाकर बयालीस मिलियन डॉलर तक पहुँचाया।',
             'Español': 'Este trimestre crecimos el ARR un treinta por ciento, hasta cuarenta y dos millones.' } },
  { who: 'Amara Okafor', en: 'Net retention landed at a hundred and eighteen percent — highest in four quarters.',
    lines: { 'हिन्दी': 'नेट रिटेंशन एक सौ अठारह प्रतिशत पर है — पिछली चार तिमाहियों में सबसे ऊँचा।',
             'Español': 'La retención neta llegó al ciento dieciocho por ciento, la más alta en cuatro trimestres.' } },
];

const state = {
  participants: [
    { id: 'ao', name: 'Amara Okafor', initials: 'AO', role: 'Speaker', lang: 'EN', spoke: 21, engagement: 96, muted: false, online: true },
    { id: 'sr', name: 'Sofía Ramírez', initials: 'SR', role: 'Co-host', lang: 'ES', spoke: 7, engagement: 91, muted: false, online: true },
    { id: 'kt', name: 'Kenji Tanaka', initials: 'KT', role: 'Attendee', lang: 'JA', spoke: 1, engagement: 54, muted: false, online: true },
    { id: 'lw', name: 'Lukas Weber', initials: 'LW', role: 'Presenter', lang: 'DE', spoke: 6, engagement: 84, muted: false, online: true },
  ],
  transcript: [],
  claps: 87,
  energy: 82,
  poll: { question: 'Which blocker hurts most right now?', options: ['Pricing approvals', 'Security review queue', 'Integration gaps', 'Onboarding time'], votes: [52, 30, 20, 10] },
  questions: [
    { id: 'q1', text: 'Will the November packaging change affect customers already on annual contracts?', who: 'Kenji Tanaka', votes: 64, voters: [] },
    { id: 'q2', text: 'What drove net retention to 118% — expansion or lower churn?', who: 'Sofía Ramírez', votes: 41, voters: [] },
  ],
};

let scriptIdx = 0;
function nextTranscriptLine() {
  const entry = TRANSCRIPT_SCRIPT[scriptIdx % TRANSCRIPT_SCRIPT.length];
  scriptIdx += 1;
  const line = {
    id: `t${Date.now()}`,
    t: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    who: entry.who,
    en: entry.en,
    lines: entry.lines,
  };
  state.transcript.push(line);
  if (state.transcript.length > 30) state.transcript.shift();
  io.emit('transcript:line', line);
}
setInterval(nextTranscriptLine, 6000);

function broadcastPresence() {
  io.emit('presence:update', state.participants);
}

io.on('connection', (socket) => {
  socket.emit('state:init', state);

  socket.on('user:join', ({ name, roomCode, language }) => {
    const id = socket.id;
    const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
    const participant = { id, name, initials, role: 'Attendee', lang: language || 'EN', spoke: 0, engagement: 0, muted: false, online: true };
    state.participants.push(participant);
    broadcastPresence();
    socket.data.participantId = id;
  });

  socket.on('clap', () => {
    state.claps += 1;
    state.energy = Math.min(100, state.energy + 1);
    io.emit('clap:update', { claps: state.claps, energy: state.energy });
  });

  socket.on('poll:vote', (idx) => {
    if (state.poll.votes[idx] === undefined) return;
    state.poll.votes[idx] += 1;
    io.emit('poll:update', state.poll);
  });

  socket.on('qa:ask', (text) => {
    const q = { id: `q${Date.now()}`, text, who: 'You', votes: 0, voters: [] };
    state.questions.unshift(q);
    io.emit('qa:update', state.questions);
  });

  socket.on('qa:upvote', (id) => {
    const q = state.questions.find((x) => x.id === id);
    if (!q) return;
    q.votes += 1;
    io.emit('qa:update', state.questions);
  });

  socket.on('participant:mute', (id) => {
    const p = state.participants.find((x) => x.id === id);
    if (!p) return;
    p.muted = !p.muted;
    broadcastPresence();
  });

  socket.on('disconnect', () => {
    const id = socket.data.participantId;
    if (!id) return;
    state.participants = state.participants.filter((p) => p.id !== id);
    broadcastPresence();
  });
});

app.get('/health', (_req, res) => res.json({ ok: true }));

httpServer.listen(PORT, () => console.log(`Sama.ai server listening on :${PORT}`));
