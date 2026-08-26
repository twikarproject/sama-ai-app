import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '../state/store';
import { ScreenShell } from '../components/ScreenShell';
import { Logo } from '../components/Logo';

export function PreJoin() {
  const { state, dispatch, actions } = useRoom();
  const navigate = useNavigate();

  return (
    <ScreenShell>
      <div style={{ height: 62, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', borderBottom: '1px solid var(--color-divider)' }}>
        <Logo />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13 }}>
          <span>{state.user?.roomCode ?? 'Q3 Business Review'}</span>
          <span style={{ width: 1, height: 14, background: 'var(--color-divider)' }} />
          <span style={{ color: 'var(--color-neutral-600)' }}>Starts 15:00 IST</span>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: 32, padding: 24, minHeight: 0 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ flex: 1, borderRadius: 14, background: 'var(--color-neutral-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <span style={{ fontSize: 76, color: 'var(--color-neutral-600)' }}>{(state.user?.name ?? 'A M').split(' ').map(w => w[0]).join('')}</span>
            <div style={{ position: 'absolute', left: 14, bottom: 14, background: 'var(--color-bg)', border: '1px solid var(--color-divider)', borderRadius: 8, padding: '6px 12px', fontSize: 13 }}>
              {state.user?.name ?? 'Aarav Mehta'} <span style={{ color: 'var(--color-neutral-600)', fontStyle: 'italic' }}>you</span>
            </div>
          </div>
        </div>

        <div style={{ width: 460, flex: 'none', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <h3 style={{ margin: '0 0 4px' }}>Language & comfort</h3>
            <span style={{ fontSize: 12.5, fontStyle: 'italic', color: 'var(--color-neutral-600)' }}>Only you hear it this way. Change it any time.</span>
          </div>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, color: 'var(--color-neutral-700)' }}>
            I want to hear this meeting in
            <select className="input" value={state.language} onChange={e => dispatch({ type: 'set_language', lang: e.target.value })}>
              <option>English</option>
              <option>हिन्दी · Hindi</option>
              <option>Español</option>
              <option>日本語</option>
              <option>Deutsch</option>
            </select>
          </label>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 12.5, color: 'var(--color-neutral-700)' }}>Deliver it as</span>
            <div style={{ display: 'flex', border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              {(['audio', 'subtitles', 'both'] as const).map(v => (
                <button key={v} type="button" onClick={() => dispatch({ type: 'set_delivery', value: v })}
                  style={{
                    flex: 1, padding: '10px 8px', fontSize: 13, cursor: 'pointer', border: 0, borderLeft: '1px solid var(--color-divider)',
                    background: state.delivery === v ? 'var(--color-accent-200)' : 'transparent',
                    color: state.delivery === v ? 'var(--color-accent-700)' : 'var(--color-text)',
                  }}>
                  {v === 'audio' ? 'Translated audio' : v === 'subtitles' ? 'Live subtitles' : 'Both'}
                </button>
              ))}
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
            <input type="checkbox" checked={state.cleanup} onChange={() => dispatch({ type: 'toggle_cleanup' })} />
            Clean up speech (removes filler words, fixes grammar)
          </label>

          <button className="btn btn-primary btn-block" style={{ height: 48, fontSize: 16, marginTop: 'auto' }}
            disabled={!state.connected}
            onClick={() => navigate('/translation')}>
            {state.connected ? 'Join meeting' : 'Connecting…'}
          </button>
        </div>
      </div>
    </ScreenShell>
  );
}
