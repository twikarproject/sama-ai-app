import React from 'react';
import { useRoom } from '../state/store';
import { ScreenShell } from '../components/ScreenShell';
import { Filmstrip } from '../components/Filmstrip';
import { Toolbar } from '../components/Toolbar';

export function LiveTranslation() {
  const { state } = useRoom();
  const speaker = state.participants.find(p => p.role === 'Speaker') ?? { name: 'Amara Okafor', initials: 'AO', role: 'Speaker' } as any;
  const latest = state.transcript[state.transcript.length - 1];
  const latestTranslated = latest ? (latest.lines[state.transcriptLang] ?? latest.en) : '';

  return (
    <ScreenShell>
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, padding: 16, minWidth: 0 }}>
          <Filmstrip />
          <div style={{ flex: 1, borderRadius: 14, background: 'var(--color-neutral-900)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
            <span style={{ fontSize: 88, color: 'var(--color-neutral-600)' }}>{speaker.initials}</span>

            <div style={{ position: 'absolute', left: 14, top: 14, background: 'var(--color-bg)', border: '1px solid var(--color-divider)', borderRadius: 8, padding: '6px 12px', display: 'flex', gap: 9, alignItems: 'baseline' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent-2)', alignSelf: 'center' }} />
              <span style={{ fontSize: 13 }}>{speaker.name}</span>
              <span style={{ fontSize: 11, fontStyle: 'italic', color: 'var(--color-neutral-600)' }}>VP Revenue · speaking</span>
            </div>

            <div style={{ position: 'absolute', right: 14, top: 14, background: 'var(--color-bg)', border: '1px solid var(--color-accent-600)', borderRadius: 8, padding: '5px 11px', fontSize: 12, color: 'var(--color-accent-700)' }}>
              Hearing in {state.transcriptLang}
            </div>

            <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 18, width: 760, background: 'var(--color-bg)', border: '1px solid var(--color-divider)', boxShadow: 'var(--shadow-md)', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 12.5, fontStyle: 'italic', color: 'var(--color-neutral-500)' }}>{latest?.en ?? 'Waiting for the speaker…'}</span>
              <span className="dev" style={{ fontSize: 25, letterSpacing: '-.01em' }}>{latestTranslated}</span>
              <div style={{ display: 'flex', gap: 9 }}>
                <span className="tag tag-outline">Translated from English · cleaned</span>
                <span style={{ fontSize: 11, fontStyle: 'italic', color: 'var(--color-neutral-500)' }}>Natural dub · 0.6s behind</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ width: 380, flex: 'none', borderLeft: '1px solid var(--color-divider)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ padding: 16, borderBottom: '1px solid var(--color-divider)', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h4 style={{ margin: 0 }}>Live Transcript</h4>
              <span style={{ fontSize: 10, color: 'var(--color-accent-2-700)' }}>● LIVE</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['हिन्दी', 'English', 'Español'].map(l => (
                <button key={l} onClick={() => dispatch({ type: 'set_transcript_lang', lang: l })}
                  className="dev" style={{
                    fontSize: 12, padding: '4px 10px', borderRadius: 8, cursor: 'pointer',
                    border: `1px solid ${state.transcriptLang === l ? 'var(--color-accent-600)' : 'var(--color-divider)'}`,
                    color: state.transcriptLang === l ? 'var(--color-accent-700)' : 'var(--color-text)',
                    background: 'transparent',
                  }}>{l}</button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {state.transcript.length === 0 && (
              <span style={{ fontSize: 12.5, fontStyle: 'italic', color: 'var(--color-neutral-500)' }}>Connecting to the room…</span>
            )}
            {state.transcript.map((line, i) => (
              <div key={line.id} style={{ opacity: i === state.transcript.length - 1 ? 1 : 0.55 + i * 0.1 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 3 }}>
                  <span style={{ fontSize: 11, color: 'var(--color-neutral-600)' }}>{line.t}</span>
                  <span style={{ fontSize: 13 }}>{line.who}</span>
                </div>
                <p className="dev" style={{ margin: 0, fontSize: 13.5, textAlign: 'justify' }}>{line.lines[state.transcriptLang] ?? line.en}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Toolbar />
    </ScreenShell>
  );
}
