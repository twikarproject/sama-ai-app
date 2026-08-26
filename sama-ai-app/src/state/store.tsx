import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { socket } from '../lib/socket';

export type Participant = {
  id: string; name: string; initials: string; role: string; lang: string; spoke: number; engagement: number; muted?: boolean; online?: boolean;
};
export type TranscriptLine = { id: string; t: string; who: string; en: string; lines: Record<string, string> };
export type Question = { id: string; text: string; who: string; votes: number };
export type Poll = { question: string; options: string[]; votes: number[] };

type RoomState = {
  connected: boolean;
  user: { name: string; roomCode: string } | null;
  language: string;
  delivery: 'audio' | 'subtitles' | 'both';
  cleanup: boolean;
  voice: 'original' | 'dub';
  transcriptLang: string;
  claps: number;
  energy: number;
  participants: Participant[];
  transcript: TranscriptLine[];
  poll: Poll;
  questions: Question[];
};

type Action =
  | { type: 'connected'; value: boolean }
  | { type: 'login'; name: string; roomCode: string }
  | { type: 'set_language'; lang: string }
  | { type: 'set_delivery'; value: RoomState['delivery'] }
  | { type: 'toggle_cleanup' }
  | { type: 'set_voice'; value: RoomState['voice'] }
  | { type: 'set_transcript_lang'; lang: string }
  | { type: 'server:init'; payload: any }
  | { type: 'server:transcript_line'; payload: TranscriptLine }
  | { type: 'server:clap_update'; payload: { claps: number; energy: number } }
  | { type: 'server:poll_update'; payload: Poll }
  | { type: 'server:qa_update'; payload: Question[] }
  | { type: 'server:presence'; payload: Participant[] };

const initialState: RoomState = {
  connected: false,
  user: null,
  language: 'हिन्दी · Hindi',
  delivery: 'both',
  cleanup: true,
  voice: 'dub',
  transcriptLang: 'हिन्दी',
  claps: 0,
  energy: 0,
  participants: [],
  transcript: [],
  poll: { question: '', options: [], votes: [] },
  questions: [],
};

function reducer(state: RoomState, action: Action): RoomState {
  switch (action.type) {
    case 'connected': return { ...state, connected: action.value };
    case 'login': return { ...state, user: { name: action.name, roomCode: action.roomCode } };
    case 'set_language': return { ...state, language: action.lang, transcriptLang: action.lang.split(' · ')[0] };
    case 'set_delivery': return { ...state, delivery: action.value };
    case 'toggle_cleanup': return { ...state, cleanup: !state.cleanup };
    case 'set_voice': return { ...state, voice: action.value };
    case 'set_transcript_lang': return { ...state, transcriptLang: action.lang };
    case 'server:init':
      return { ...state, participants: action.payload.participants, transcript: action.payload.transcript, claps: action.payload.claps, energy: action.payload.energy, poll: action.payload.poll, questions: action.payload.questions };
    case 'server:transcript_line':
      return { ...state, transcript: [...state.transcript, action.payload].slice(-30) };
    case 'server:clap_update':
      return { ...state, claps: action.payload.claps, energy: action.payload.energy };
    case 'server:poll_update':
      return { ...state, poll: action.payload };
    case 'server:qa_update':
      return { ...state, questions: action.payload };
    case 'server:presence':
      return { ...state, participants: action.payload };
    default: return state;
  }
}

const RoomContext = createContext<{ state: RoomState; dispatch: React.Dispatch<Action>; actions: ReturnType<typeof makeActions> } | null>(null);

function makeActions(dispatch: React.Dispatch<Action>) {
  return {
    join: (name: string, roomCode: string, language: string) => {
      dispatch({ type: 'login', name, roomCode });
      socket.emit('user:join', { name, roomCode, language });
    },
    clap: () => socket.emit('clap'),
    votePoll: (idx: number) => socket.emit('poll:vote', idx),
    askQuestion: (text: string) => socket.emit('qa:ask', text),
    upvoteQuestion: (id: string) => socket.emit('qa:upvote', id),
    toggleMute: (id: string) => socket.emit('participant:mute', id),
  };
}

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const actions = useMemo(() => makeActions(dispatch), []);

  useEffect(() => {
    const onConnect = () => dispatch({ type: 'connected', value: true });
    const onDisconnect = () => dispatch({ type: 'connected', value: false });
    const onInit = (payload: any) => dispatch({ type: 'server:init', payload });
    const onLine = (payload: TranscriptLine) => dispatch({ type: 'server:transcript_line', payload });
    const onClap = (payload: any) => dispatch({ type: 'server:clap_update', payload });
    const onPoll = (payload: Poll) => dispatch({ type: 'server:poll_update', payload });
    const onQa = (payload: Question[]) => dispatch({ type: 'server:qa_update', payload });
    const onPresence = (payload: Participant[]) => dispatch({ type: 'server:presence', payload });

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('state:init', onInit);
    socket.on('transcript:line', onLine);
    socket.on('clap:update', onClap);
    socket.on('poll:update', onPoll);
    socket.on('qa:update', onQa);
    socket.on('presence:update', onPresence);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('state:init', onInit);
      socket.off('transcript:line', onLine);
      socket.off('clap:update', onClap);
      socket.off('poll:update', onPoll);
      socket.off('qa:update', onQa);
      socket.off('presence:update', onPresence);
    };
  }, []);

  const value = useMemo(() => ({ state, dispatch, actions }), [state]);
  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}

export function useRoom() {
  const ctx = useContext(RoomContext);
  if (!ctx) throw new Error('useRoom must be used within RoomProvider');
  return ctx;
}
