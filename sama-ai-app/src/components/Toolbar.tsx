import React from 'react';
import { useRoom } from '../state/store';

const CLAP = (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M7.5 16.8c-2 0-3.5-1.6-3.5-3.6V8.4a1.1 1.1 0 0 1 2.2 0v2.1M6.2 10.5V6.4a1.1 1.1 0 0 1 2.2 0v4M8.4 10.4V5.6a1.1 1.1 0 0 1 2.2 0v4.8M10.6 10.4V6.8a1.1 1.1 0 0 1 2.2 0v6.1c0 2-1.5 3.7-3.5 3.7Z" />
  </svg>
);

export function Toolbar({ title = 'Q3 Business Review', elapsed = '28:12' }: { title?: string; elapsed?: string }) {
  const { state, actions } = useRoom();
  return (
    <div style={{ height: 74, flex: 'none', borderTop: '1px solid var(--color-divider)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
      <div style={{ width: 280, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-accent-2)' }} />
        <span style={{ fontSize: 13 }}>{title}</span>
        <span style={{ fontSize: 12, color: 'var(--color-neutral-600)' }}>{elapsed}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button className="btn btn-secondary btn-icon" title="Microphone">🎙</button>
        <button className="btn btn-secondary btn-icon" title="Camera">📷</button>
        <button className="btn btn-secondary btn-icon" title="Share">🖥</button>
        <span style={{ width: 1, height: 26, background: 'var(--color-divider)', margin: '0 8px' }} />
        <button className="btn btn-primary" style={{ gap: 9, height: 36 }} onClick={actions.clap}>
          {CLAP}<span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 15 }}>{state.claps}</span>
        </button>
        <button className="btn btn-secondary btn-icon" title="Reactions">😊</button>
        <span style={{ width: 1, height: 26, background: 'var(--color-divider)', margin: '0 8px' }} />
        <button className="btn btn-secondary btn-icon" title="Activities">▦</button>
        <button className="btn btn-secondary btn-icon" title="Chat">💬</button>
        <button className="btn btn-secondary btn-icon" title="Q&A">❓</button>
        <button className="btn btn-secondary btn-icon" title="Notes">📝</button>
      </div>

      <div style={{ width: 280, display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary destructive" style={{ height: 36 }}>Leave</button>
      </div>
    </div>
  );
}
