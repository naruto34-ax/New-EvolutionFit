CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  age INTEGER CHECK (age IS NULL OR age > 0),
  gender VARCHAR(50),
  population VARCHAR(50) NOT NULL DEFAULT 'general',
  preferred_space VARCHAR(20) NOT NULL DEFAULT 'gym',
  level VARCHAR(20) NOT NULL DEFAULT 'beginner',
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exercises (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  space VARCHAR(20) NOT NULL,
  level VARCHAR(20) NOT NULL,
  muscle VARCHAR(100),
  video_url TEXT,
  CONSTRAINT exercises_category_check
    CHECK (category IN ('hiit', 'strength', 'cardio', 'flexibility', 'calisthenics')),
  CONSTRAINT exercises_space_check
    CHECK (space IN ('gym', 'park', 'home')),
  CONSTRAINT exercises_level_check
    CHECK (level IN ('beginner', 'intermediate', 'advanced'))
);

CREATE INDEX IF NOT EXISTS exercises_filters_idx
  ON exercises (space, category, level);

CREATE TABLE IF NOT EXISTS routines (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  space VARCHAR(20) NOT NULL,
  level VARCHAR(20) NOT NULL,
  category VARCHAR(50) NOT NULL,
  population VARCHAR(50) NOT NULL DEFAULT 'general',
  duration INTEGER NOT NULL CHECK (duration BETWEEN 10 AND 120),
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  is_generated BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS routines_user_created_idx
  ON routines (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS routine_exercises (
  id SERIAL PRIMARY KEY,
  routine_id INTEGER NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
  exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE RESTRICT,
  position INTEGER NOT NULL CHECK (position > 0),
  sets INTEGER NOT NULL CHECK (sets > 0),
  reps VARCHAR(32) NOT NULL,
  rest_seconds INTEGER NOT NULL DEFAULT 60 CHECK (rest_seconds >= 0),
  UNIQUE (routine_id, position)
);

