import React from 'react';
import { useRoom } from '../state/store';

export function Filmstrip() {
  const { state } = useRoom();
  return (
    <div style={{ flex: 'none', display: 'flex', gap: 10 }}>
      {state.participants.filter(p => p.role !== 'Speaker').slice(0, 6).map(p => (
        <figure key={p.id} style={{ width: 150, margin: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div style={{ height: 84, borderRadius: 'var(--radius-md)', background: 'var(--color-neutral-900)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 22, color: 'var(--color-neutral-500)' }}>{p.initials}</span>
          </div>
          <figcaption style={{ display: 'flex', justifyContent: 'space-between', gap: 6, fontSize: 12 }}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
            <span style={{ fontSize: 10, color: 'var(--color-accent-700)' }}>{p.lang}</span>
          </figcaption>
        </figure>
      ))}
      <div style={{ flex: 1, minWidth: 0, height: 84, border: '1px dashed var(--color-divider)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 16, fontWeight: 700 }}>+134</span>
        <span style={{ fontSize: 10.5, color: 'var(--color-neutral-600)' }}>others</span>
      </div>
    </div>
  );
}
