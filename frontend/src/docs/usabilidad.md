# Usabilidad (#17)

## Lighthouse (Accesibilidad)

| Pantalla | Antes | Después |
|---|---|---|
| /tienda | 91 | 95 |
| /mis-pedidos | 92 | 94 |
| /admin/pedidos | 95 | 95 |

## Problemas detectados y arreglos

| Pantalla | Problema | Arreglo | Estado |
|---|---|---|---|
| Pedidos (admin) | Cancelar usaba window.confirm | ConfirmModal con botones que dicen qué hacen | Hecho |
| Modales | El foco se salía del modal y no volvía | Foco atrapado, Esc y devolver el foco | Hecho |
| Tienda | Buscador sin etiqueta y filtros sin estado | aria-label y aria-pressed | Hecho |
| Todas | Pantalla en blanco al cargar o fallar | useAsync con estados de carga, vacío y error | Hecho |
| Pago | Errores lejos del campo | aria-describedby y foco al primer error | Hecho |
| Avisos | Duraban 3,5 s aunque fueran errores | 7 s para errores y avisos | Hecho |
| App | Sin menú, migas ni salto al contenido | AppLayout con Navbar, Breadcrumbs y Footer | Hecho |
| Barra de pruebas | Contraste insuficiente | Colores corregidos | Hecho |


## Pendiente (pasada global, cuando todo esté en master)

- Lighthouse de todas las pantallas de los demás módulos
- Revisión con lector de pantalla del flujo completo
- Aplicar la guía de reglas a las pantallas nuevas del equipo