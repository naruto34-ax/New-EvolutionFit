import AssignCoach from './AssignCoach';
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001';

function Routines({ token, onBack }) {
  const [space, setSpace] = useState('gym');
  const [level, setLevel] = useState('beginner');
  const [category, setCategory] = useState('strength');
  const [duration, setDuration] = useState(30);

  const [routine, setRoutine] = useState(null);
  const [routines, setRoutines] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadRoutines = async () => {
    setLoadingHistory(true);
    setHistoryError('');

    try {
      const response = await fetch(`${API_URL}/api/routines/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo cargar el historial.');

      setRoutines(data.routines || []);
    } catch (err) {
      setHistoryError(err.message || 'Error al cargar el historial.');
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (token) loadRoutines();
  }, [token]);

  const generateRoutine = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setRoutine(null);

    try {
      const response = await fetch(`${API_URL}/api/routines/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: `Rutina de ${category.toUpperCase()}`,
          space,
          level,
          category,
          population: 'general',
          duration: Number(duration),
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'No se pudo generar la rutina.');

      setRoutine(data.routine);
      await loadRoutines();
    } catch (err) {
      setError(err.message || 'No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: '850px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif', color: '#e2e8f0' }}>
      <button 
        type="button" 
        onClick={onBack}
        style={{ 
          background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', 
          fontSize: '0.95rem', fontWeight: '500', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: 0 
        }}
      >
        ← Volver al panel principal
      </button>

      <div style={{ background: '#1e293b', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.4)', border: '1px solid #334155' }}>
        
        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', color: '#f8fafc', fontWeight: '700' }}>Rutinas Inteligentes</h1>
        <p style={{ color: '#94a3b8', marginBottom: '2rem', fontSize: '1rem' }}>
          Configura tus preferencias de entrenamiento y genera rutinas optimizadas automáticamente.
        </p>

        {/* Módulo de Asignación de Coach */}
        <AssignCoach token={token} />

        {/* Formulario de generación */}
        <form onSubmit={generateRoutine} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem', background: '#0f172a', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.4rem', color: '#cbd5e1', textTransform: 'uppercase' }}>Espacio</label>
            <select id="space" value={space} onChange={(e) => setSpace(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#1e293b', color: '#fff', border: '1px solid #475569', outline: 'none' }}>
              <option value="gym">🏋️ Gimnasio</option>
              <option value="home">🏠 Casa</option>
              <option value="park">🌳 Parque</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.4rem', color: '#cbd5e1', textTransform: 'uppercase' }}>Nivel</label>
            <select id="level" value={level} onChange={(e) => setLevel(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#1e293b', color: '#fff', border: '1px solid #475569', outline: 'none' }}>
              <option value="beginner">🟢 Principiante</option>
              <option value="intermediate">🟡 Intermedio</option>
              <option value="advanced">🔴 Avanzado</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.4rem', color: '#cbd5e1', textTransform: 'uppercase' }}>Categoría</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#1e293b', color: '#fff', border: '1px solid #475569', outline: 'none' }}>
              <option value="strength">💪 Fuerza</option>
              <option value="cardio">🏃 Cardio</option>
              <option value="hiit">⚡ HIIT</option>
              <option value="flexibility">🧘 Flexibilidad</option>
              <option value="calisthenics">🤸 Calistenia</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.4rem', color: '#cbd5e1', textTransform: 'uppercase' }}>Duración</label>
            <select id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#1e293b', color: '#fff', border: '1px solid #475569', outline: 'none' }}>
              <option value={10}>⏱️ 10 minutos</option>
              <option value={20}>⏱️ 20 minutos</option>
              <option value={30}>⏱️ 30 minutos</option>
              <option value={45}>⏱️ 45 minutos</option>
              <option value={60}>⏱️ 60 minutos</option>
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
            <button 
              type="submit" 
              disabled={loading}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: loading ? '#475569' : '#0ea5e9', color: '#fff', fontWeight: 'bold', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem', transition: 'background 0.2s', boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)' }}
            >
              {loading ? 'Generando rutina inteligente...' : '⚡ Generar y Guardar Rutina'}
            </button>
          </div>
        </form>

        {error && <p style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '12px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)', fontSize: '0.9rem' }}>{error}</p>}

        {/* Rutina recién generada */}
        {routine && (
          <div style={{ background: '#0f172a', padding: '1.75rem', borderRadius: '12px', marginTop: '2rem', border: '1px solid #0ea5e9', boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }}>
            <h2 style={{ color: '#38bdf8', marginTop: 0, fontSize: '1.4rem' }}>✨ {routine.name}</h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>{routine.description}</p>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>⏱️ Duración estimada: <strong>{routine.duration} minutos</strong></p>
            
            <h3 style={{ borderBottom: '1px solid #334155', paddingBottom: '0.5rem', marginTop: '1.5rem', fontSize: '1.1rem' }}>Ejercicios de la Sesión</h3>
            <ol style={{ paddingLeft: '1.2rem', lineHeight: '1.6' }}>
              {routine.exercises.map((exercise) => (
                <li key={exercise.id} style={{ marginBottom: '0.75rem' }}>
                  <strong style={{ color: '#f8fafc' }}>{exercise.name}</strong>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    Series: {exercise.sets} · Repeticiones: {exercise.reps} · Descanso: {exercise.restSeconds}s
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Sección de Historial Profesional */}
        <div style={{ marginTop: '3.5rem', borderTop: '1px solid #334155', paddingTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', margin: '0 0 0.25rem 0', color: '#f8fafc' }}>Mis Rutinas Guardadas</h2>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>Accede al historial de tus entrenamientos anteriores.</p>
            </div>
            
            <button 
              type="button" 
              onClick={loadRoutines} 
              disabled={loadingHistory}
              style={{ 
                background: '#334155', color: '#f8fafc', border: '1px solid #475569', 
                padding: '8px 16px', borderRadius: '20px', cursor: loadingHistory ? 'not-allowed' : 'pointer', 
                fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px',
                transition: 'all 0.2s ease', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}
            >
              <span style={{ display: 'inline-block', transition: 'transform 0.3s', transform: loadingHistory ? 'rotate(360deg)' : 'none' }}>
                🔄
              </span>
              {loadingHistory ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>

          {historyError && <p style={{ color: '#f87171', fontSize: '0.9rem' }}>{historyError}</p>}
          {loadingHistory && <p style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.9rem' }}>Cargando historial...</p>}

          {!loadingHistory && !historyError && routines.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2.5rem', background: '#0f172a', borderRadius: '12px', border: '1px dashed #334155' }}>
              <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>No tienes rutinas guardadas todavía. ¡Genera la primera arriba!</p>
            </div>
          )}

          <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
            {routines.map((item) => (
              <article key={item.id} style={{ background: '#0f172a', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid #334155' }}>
                <h3 style={{ margin: '0 0 0.35rem 0', color: '#38bdf8', fontSize: '1.15rem' }}>{item.name}</h3>
                
                {/* Formato solicitado: Tipo de rutina y Nombre del Coach */}
                <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span>🏋️ <strong>Tipo:</strong> Rutina de {item.category.toUpperCase()} ({item.space})</span>
                  <span>👨‍🏫 <strong>Nombre del coach:</strong> {item.coach_name}</span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.8rem' }}>
                  <span style={{ background: '#1e293b', padding: '4px 10px', borderRadius: '6px', color: '#94a3b8', border: '1px solid #334155' }}>⏱️ {item.duration} mins</span>
                  <span style={{ background: '#1e293b', padding: '4px 10px', borderRadius: '6px', color: '#94a3b8', border: '1px solid #334155' }}>📊 {item.level}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}

export default Routines;