import { useState } from 'react';
import api from '../services/api'; // Ajusta esta ruta a donde guardaste tu archivo unificado api.js

export default function AssignCoach() {
  const coaches = [
    { id: 'coach-cboom', name: 'CBoom' }
  ];

  const [selectedCoach, setSelectedCoach] = useState('coach-cboom');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedCoach) return;
    
    setLoading(true);
    setMessage(null);
    
    try {
      // Usamos la instancia 'api'. El token y la URL base se inyectan automáticamente
      const response = await api.put('/users/assign-coach', { coachId: selectedCoach });
      
      if (response.data.success) {
        setMessage('Coach asignado correctamente.');
      } else {
        setMessage('No se pudo completar la asignación.');
      }
    } catch (err) {
      console.error(err);
      // Aprovechamos el error personalizado que configuraste en tu interceptor
      setMessage(err.userMessage || 'Error de conexión con el servidor.');
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
      width: '320px', // Ancho fijo para que se vea bien como dropdown
      boxSizing: 'border-box'
    }}>
      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: '#38bdf8' }}>🏋️ Tu Entrenador</h3>
      <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
        Selecciona tu coach personal.
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