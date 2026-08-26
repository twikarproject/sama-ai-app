import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '../state/store';
import { Logo } from '../components/Logo';

export function Login() {
  const { state, actions } = useRoom();
  const navigate = useNavigate();
  const [name, setName] = useState('Aarav Mehta');
  const [roomCode, setRoomCode] = useState('q3-business-review');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    actions.join(name, roomCode, state.language);
    navigate('/pre-join');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={onSubmit} className="card" style={{ width: 420, padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Logo size={40} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 13, color: 'var(--color-neutral-700)' }}>Enter your name and the room code to join.</span>
        </div>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5 }}>
          Name
          <input className="input" value={name} onChange={e => setName(e.target.value)} required />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5 }}>
          Room code
          <input className="input" value={roomCode} onChange={e => setRoomCode(e.target.value)} required />
        </label>
        <button className="btn btn-primary btn-block" style={{ height: 48 }} type="submit">Continue</button>
      </form>
    </div>
  );
}
