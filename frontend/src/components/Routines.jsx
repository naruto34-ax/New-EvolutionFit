
import { useState, useEffect } from 'react';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

  // Cargar el historial de rutinas guardadas.
  const loadRoutines = async () => {
    setLoadingHistory(true);
    setHistoryError('');

    try {
      const response = await fetch(
        `${API_URL}/api/routines/mine`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'No se pudo cargar el historial.'
        );
      }

      setRoutines(data.routines || []);
    } catch (err) {
      setHistoryError(
        err.message || 'Error al cargar el historial.'
      );
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadRoutines();
    }
  }, [token]);

  // Generar una rutina y actualizar el historial.
  const generateRoutine = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError('');
    setRoutine(null);

    try {
      const response = await fetch(
        `${API_URL}/api/routines/generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: `Mi rutina de ${category}`,
            space,
            level,
            category,
            population: 'general',
            duration: Number(duration),
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || 'No se pudo generar la rutina.'
        );
      }

      setRoutine(data.routine);

      // Consultar nuevamente las rutinas ya guardadas.
      await loadRoutines();
    } catch (err) {
      setError(
        err.message || 'No se pudo conectar con el servidor.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="routines-page">
      <section className="routines-card">
        <button type="button" onClick={onBack}>
          ← Volver
        </button>

        <h1>Rutinas automáticas</h1>

        <p>
          Elige tus preferencias y genera una rutina
          con los ejercicios disponibles.
        </p>

        <form onSubmit={generateRoutine}>
          <label htmlFor="space">Espacio</label>
          <select
            id="space"
            value={space}
            onChange={(e) => setSpace(e.target.value)}
          >
            <option value="gym">Gimnasio</option>
            <option value="home">Casa</option>
            <option value="park">Parque</option>
          </select>

          <label htmlFor="level">Nivel</label>
          <select
            id="level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="beginner">Principiante</option>
            <option value="intermediate">Intermedio</option>
            <option value="advanced">Avanzado</option>
          </select>

          <label htmlFor="category">Categoría</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="strength">Fuerza</option>
            <option value="cardio">Cardio</option>
            <option value="hiit">HIIT</option>
            <option value="flexibility">Flexibilidad</option>
            <option value="calisthenics">Calistenia</option>
          </select>

          <label htmlFor="duration">
            Duración (minutos)
          </label>
          <select
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            <option value={10}>10 minutos</option>
            <option value={20}>20 minutos</option>
            <option value={30}>30 minutos</option>
            <option value={45}>45 minutos</option>
            <option value={60}>60 minutos</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? 'Generando...' : 'Generar rutina'}
          </button>
        </form>

        {error && (
          <p role="alert" className="routine-error">
            {error}
          </p>
        )}

        {routine && (
          <section className="routine-result">
            <h2>{routine.name}</h2>
            <p>{routine.description}</p>
            <p>
              Duración: {routine.duration} minutos
            </p>

            <h3>Ejercicios</h3>

            <ol>
              {routine.exercises.map((exercise) => (
                <li key={exercise.id}>
                  <strong>{exercise.name}</strong>
                  <p>
                    Series: {exercise.sets} ·
                    Repeticiones: {exercise.reps} ·
                    Descanso: {exercise.restSeconds} segundos
                  </p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Historial de rutinas */}
        <section className="routine-result">
          <h2>Mis rutinas guardadas</h2>

          <button
            type="button"
            onClick={loadRoutines}
            disabled={loadingHistory}
          >
            {loadingHistory ? 'Actualizando...' : 'Actualizar historial'}
          </button>

          {historyError && (
            <p role="alert" className="routine-error">
              {historyError}
            </p>
          )}

          {loadingHistory && <p>Cargando rutinas...</p>}

          {!loadingHistory &&
            !historyError &&
            routines.length === 0 && (
              <p>Todavía no tienes rutinas guardadas.</p>
            )}

          {routines.map((item) => (
            <article key={item.id}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>
                Duración: {item.duration} minutos
              </p>
              <p>
                Espacio: {item.space} · Nivel: {item.level}
              </p>
              <p>Categoría: {item.category}</p>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}

export default Routines;
