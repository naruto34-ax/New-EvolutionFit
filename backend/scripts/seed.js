require('dotenv').config({ path: '../.env' });
const pool = require('../config/connection');

const exercisesList = [
  // ⚡ HIIT
  { name: 'Burpees con salto', description: 'Ejercicio de cuerpo completo enfocado en resistencia y potencia.', category: 'hiit', space: 'home', level: 'intermediate', muscle: 'Cuerpo completo' },
  { name: 'Mountain Climbers', description: 'Escaladores en suelo a alta velocidad para cardio y abdomen.', category: 'hiit', space: 'home', level: 'beginner', muscle: 'Core' },
  { name: 'Jumping Jacks', description: 'Saltos abriendo y cerrando extremidades para elevar pulsaciones.', category: 'hiit', space: 'home', level: 'beginner', muscle: 'Cardio' },
  { name: 'High Knees (Rodillas arriba)', description: 'Carrera estática elevando las rodillas hacia el pecho.', category: 'hiit', space: 'park', level: 'intermediate', muscle: 'Piernas' },
  { name: 'Sprints cortos', description: 'Carrera a máxima velocidad en corta distancia.', category: 'hiit', space: 'park', level: 'advanced', muscle: 'Piernas' },

  // 🏃 Cardio
  { name: 'Running suave', description: 'Trote continuo a ritmo moderado.', category: 'cardio', space: 'park', level: 'beginner', muscle: 'Resistencia' },
  { name: 'Saltar la cuerda', description: 'Salto continuo con cuerda para resistencia cardiovascular.', category: 'cardio', space: 'home', level: 'intermediate', muscle: 'Pantorrillas' },
  { name: 'Ciclismo estático / Ruta', description: 'Pedaleo constante para quema calórica.', category: 'cardio', space: 'gym', level: 'beginner', muscle: 'Tren inferior' },
  { name: 'Elíptica', description: 'Movimiento fluido de bajo impacto para todo el cuerpo.', category: 'cardio', space: 'gym', level: 'beginner', muscle: 'Cuerpo completo' },

  // 💪 Fuerza
  { name: 'Sentadillas con barra', description: 'Sentadilla profunda cargando peso libre en la espalda.', category: 'strength', space: 'gym', level: 'beginner', muscle: 'Cuádriceps' },
  { name: 'Press de banca plano', description: 'Empuje de barra acostado en banco para pectoral.', category: 'strength', space: 'gym', level: 'intermediate', muscle: 'Pecho' },
  { name: 'Peso muerto convencional', description: 'Elevación de barra desde el suelo manteniendo la espalda recta.', category: 'strength', space: 'gym', level: 'advanced', muscle: 'Espalda baja y glúteos' },
  { name: 'Dominadas asistidas', description: 'Tracción vertical con soporte para la espalda y bíceps.', category: 'strength', space: 'gym', level: 'beginner', muscle: 'Espalda' },
  { name: 'Press militar con mancuernas', description: 'Desarrollo de hombros sentado o de pie.', category: 'strength', space: 'gym', level: 'intermediate', muscle: 'Hombros' },

  // 🤸 Calistenia
  { name: 'Flexiones de pecho tradicionales', description: 'Flexiones clásicas en suelo con manos a la altura de los hombros.', category: 'calisthenics', space: 'home', level: 'beginner', muscle: 'Pecho y tríceps' },
  { name: 'Dominadas estrictas (Pull-ups)', description: 'Suspensión en barra y elevación del pecho.', category: 'calisthenics', space: 'gym', level: 'advanced', muscle: 'Espalda y bíceps' },
  { name: 'Fondos en paralelas (Dips)', description: 'Flexión de brazos en barras paralelas.', category: 'calisthenics', space: 'gym', level: 'intermediate', muscle: 'Tríceps y pecho' },
  { name: 'Sentadillas Pistol (Pistol squats)', description: 'Sentadilla unipodal con una pierna extendida al frente.', category: 'calisthenics', space: 'park', level: 'advanced', muscle: 'Piernas' },
  { name: 'Plancha abdominal isométrica', description: 'Mantener posición de flexión apoyado sobre antebrazos.', category: 'calisthenics', space: 'home', level: 'beginner', muscle: 'Core' },

  // 🧘 Flexibilidad
  { name: 'Estiramiento de isquiotibiales', description: 'Flexión de tronco hacia las piernas sentado en el suelo.', category: 'flexibility', space: 'home', level: 'beginner', muscle: 'Isquiotibiales' },
  { name: 'Postura del perro boca abajo', description: 'Estiramiento global de cadena posterior.', category: 'flexibility', space: 'home', level: 'beginner', muscle: 'Espalda y piernas' },
  { name: 'Apertura de pecho en puente', description: 'Movilidad de columna y hombros.', category: 'flexibility', space: 'gym', level: 'intermediate', muscle: 'Pecho' },
  { name: 'Estiramiento de cuádriceps de pie', description: 'Flexión de rodilla tomando el empeine atrás.', category: 'flexibility', space: 'park', level: 'beginner', muscle: 'Cuádriceps' }
];

async function seedExercises() {
  try {
    console.log('🔄 Conectando a Neon para poblar ejercicios...');
    
    for (const ex of exercisesList) {
      // Usamos $7 para el WHERE name para evitar conflictos de tipos en el parámetro $1
      await pool.query(
        `INSERT INTO exercises (name, description, category, space, level, muscle) 
         SELECT $1, $2, $3, $4, $5, $6
         WHERE NOT EXISTS (
           SELECT 1 FROM exercises WHERE name = $7
         )`,
        [ex.name, ex.description, ex.category, ex.space, ex.level, ex.muscle, ex.name]
      );
    }

    console.log('✅ ¡Catálogo completo de ejercicios agregado a Neon PostgreSQL exitosamente!');
  } catch (err) {
    console.error('❌ Error insertando ejercicios:', err.message);
  } finally {
    process.exit(0);
  }
}

seedExercises();