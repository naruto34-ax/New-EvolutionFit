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

Las migraciones crean tablas para perfiles, ejercicios, rutinas, progreso, nutrición, logros, retos, mensajes, notificaciones, fotos de progreso, productos, carritos, pedidos y referencias de pago. No copian datos existentes de MySQL ni datos guardados en `localStorage`; los catálogos de ejercicios, logros, retos y productos se cargan por separado.

Esto deja listo el esquema central, pero la app todavía necesita endpoints y cambios en sus servicios de frontend para dejar de guardar esos datos en `localStorage`.

Las fotos deben guardarse en almacenamiento de archivos (por ejemplo, Vercel Blob); PostgreSQL conserva su URL y metadatos. No guardes números de tarjeta ni códigos de seguridad en la base: conserva solo el estado y las referencias del proveedor de pagos.

En producción, configura `DATABASE_URL` y `JWT_SECRET` como variables secretas del proveedor de hosting, no como archivos versionados.
