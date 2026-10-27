# Backend y Neon

El backend usa PostgreSQL y acepta una cadena de conexión `DATABASE_URL`.

## Configuración local

1. Copia `.env.example` como `.env`.
2. En `DATABASE_URL`, usa la cadena pooled que proporciona Neon; no la compartas ni la subas a Git.
3. Define un `JWT_SECRET` seguro en el entorno local y en el proveedor donde despliegues el backend.
4. Ejecuta `npm ci`.
5. Crea las tablas con `npm run db:migrate`.
6. Inicia el servidor con `npm run dev`.

La ruta `GET /api/health` comprueba que el backend puede consultar PostgreSQL.

La migración crea las tablas necesarias para usuarios, ejercicios y rutinas. No copia datos existentes de MySQL ni datos guardados en `localStorage`; el catálogo de ejercicios se carga por separado.

En producción, configura `DATABASE_URL` y `JWT_SECRET` como variables secretas del proveedor de hosting, no como archivos versionados.
