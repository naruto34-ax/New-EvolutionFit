import { useState } from 'react';

const API_URL = 'http://localhost:3001';

export default function AssignCoach({ token }) {
  const coaches = [
    { id: 'coach-cboom', name: 'CBoom' }
  ];

  const [selectedCoach, setSelectedCoach] = useState('coach-cboom');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedCoach) return;
    
    const activeToken = token || localStorage.getItem('token');
    setLoading(true);
    setMessage(null);
    
    try {
      const response = await fetch(`${API_URL}/api/users/assign-coach`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify({ coachId: selectedCoach })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setMessage('Coach asignado correctamente.');
      } else {
        setMessage(data.error || 'No se pudo completar la asignación.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: '#1e293b',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      color: '#fff',
      marginBottom: '2rem',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: '#38bdf8' }}>🏋️ Tu Entrenador Personal</h3>
      <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
        Entrenador asignado actualmente.
      </p>

      <form onSubmit={handleAssign} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <select 
          value={selectedCoach} 
          onChange={(e) => setSelectedCoach(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            background: '#0f172a',
            color: '#ffffff',
            border: '1px solid #334155',
            outline: 'none',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
        >
          {coaches.map(c => (
            <option key={c.id} value={c.id} style={{ background: '#0f172a', color: '#ffffff' }}>
              {c.name}
            </option>
          ))}
        </select>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            background: loading ? '#475569' : '#0ea5e9',
            color: '#fff',
            border: 'none',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            transition: 'background 0.2s'
          }}
        >
          {loading ? 'Asignando...' : 'Asignar'}
        </button>
      </form>

      {message && (
        <p style={{
          marginTop: '1rem',
          fontSize: '0.9rem',
          color: message.includes('correctamente') ? '#4ade80' : '#f87171',
          textAlign: 'center'
        }}>
          {message}
        </p>
      )}
    </div>
  );
}