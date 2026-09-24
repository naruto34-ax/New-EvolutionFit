# Requirements Document

## Introduction

Este módulo agrega una sección de aprendizaje académico dentro de Evolution Fit llamada **"Aprende"**. Integra dos grandes bloques de contenido teórico provenientes de documentos académicos:

1. **Fundamentos del Diseño de Software** — cubre los principios clásicos de la ingeniería de software: abstracción, modularidad, cohesión, acoplamiento, diseño arquitectónico, procedimental y de datos, entre otros.
2. **Conceptos Clave de Usabilidad** — cubre los principios de usabilidad, diseño centrado en el usuario, metodología Design Thinking, arquitectura de la información, accesibilidad y mejora continua.

El módulo se integra como una nueva página de la SPA, accesible desde la barra de navegación principal y desde los accesos rápidos del Dashboard. Mantiene el estilo visual oscuro y profesional de Evolution Fit (fondo `#0F0F1A`, tarjetas `#1E1E35`, color primario `#6C63FF`).

---

## Glossary

- **Learn_Module**: El módulo de aprendizaje académico dentro de Evolution Fit (ruta `'learn'`).
- **SDF_Block**: El bloque de contenido "Fundamentos del Diseño de Software" dentro del Learn_Module.
- **USB_Block**: El bloque de contenido "Conceptos Clave de Usabilidad" dentro del Learn_Module.
- **Topic**: Una unidad temática de contenido académico (ej. "Abstracción", "Design Thinking").
- **Section**: Un agrupador de Topics relacionados dentro de un bloque (ej. "Fundamentos del Diseño").
- **Content_Viewer**: El componente que renderiza el contenido detallado de un Topic seleccionado.
- **Topic_Navigator**: El componente de navegación lateral que lista los bloques, Sections y Topics disponibles.
- **Search_Bar**: El componente de búsqueda de texto dentro del Learn_Module.
- **Progress_Tracker**: El componente que registra y muestra qué Topics ha visitado el usuario autenticado.
- **Router**: El sistema de navegación SPA existente en `js/router.js`.
- **User**: El usuario autenticado actualmente en la plataforma.
- **Admin**: Usuario con rol `admin` en la plataforma.

---

## Requirements

### Requirement 1: Acceso al módulo desde la navegación

**User Story:** Como usuario autenticado, quiero acceder al módulo de aprendizaje desde la barra de navegación principal, para poder consultarlo en cualquier momento sin interrumpir mi flujo de uso de la plataforma.

#### Acceptance Criteria

1. THE Router SHALL registrar la ruta `'learn'` como una ruta válida que renderiza el Learn_Module.
2. WHEN un usuario autenticado hace clic en el enlace de navegación del Learn_Module, THE Router SHALL cargar el Learn_Module sin recargar la página.
3. WHEN un usuario no autenticado intenta acceder a la ruta `'learn'`, THE Router SHALL redirigirlo a la página de login.
4. THE Learn_Module SHALL ser accesible también desde la sección de accesos rápidos del Dashboard con el ícono `fas fa-book-open` y la etiqueta "Aprende".
5. WHEN el Learn_Module está activo, THE Router SHALL marcar su enlace de navegación como activo aplicando la clase CSS `active`.

---

### Requirement 2: Estructura y organización del contenido — dos bloques temáticos

**User Story:** Como estudiante, quiero ver el contenido académico organizado en dos bloques claramente diferenciados con sus secciones y temas, para navegar de forma estructurada por ambas materias.

#### Acceptance Criteria

1. THE Learn_Module SHALL presentar dos bloques de contenido seleccionables mediante pestañas principales:
   - **Bloque A — Fundamentos del Diseño de Software** con 10 Sections:
     - Ingeniería y Diseño del Software
     - El Proceso de Diseño
     - Diseño y Calidad del Software
     - Características Comunes de las Metodologías
     - Fundamentos del Diseño (Abstracción, Refinamiento, Modularidad, Arquitectura, Jerarquía de Control, Estructura de Datos, Procedimientos, Ocultamiento de Información)
     - Diseño Modular Efectivo (Tipos de Módulos, Independencia Funcional, Cohesión, Acoplamiento)
     - Diseño de Datos
     - Diseño Arquitectónico
     - Diseño Procedimental (Programación Estructurada, Diagramas de Flujo, Diagramas de Cajas, Tablas de Decisión, LDP)
     - Documentación del Diseño
   - **Bloque B — Conceptos Clave de Usabilidad** con 14 Topics:
     - ¿Qué es Usabilidad? (Eficacia, Eficiencia, Satisfacción)
     - Diseño Centrado en el Usuario
     - Metodología Design Thinking (6 etapas)
     - Conocer al Usuario (Proto-personas, Mapas de Empatía, Escenarios)
     - Definir Objetivos Claros del Sistema
     - Arquitectura de la Información
     - Organización y Jerarquía del Contenido
     - Diseño Visual Consistente
     - Página de Inicio Enfocada en Tareas
     - Lenguaje Claro y Consistente
     - Navegación Clara
     - Accesibilidad
     - Pruebas Constantes
     - Mejora Continua e Iteración
2. WHEN el Learn_Module se carga por primera vez, THE Topic_Navigator SHALL mostrar el Bloque A activo por defecto con todas sus Sections expandidas.
3. THE Topic_Navigator SHALL permitir expandir y colapsar cada Section de forma independiente.
4. WHEN el usuario selecciona un Topic, THE Content_Viewer SHALL mostrar el contenido completo de ese Topic sin navegar a una URL diferente.
5. THE Learn_Module SHALL mostrar un indicador visual (check verde) junto a cada Topic que el usuario ya haya visitado.

---

### Requirement 3: Visualización del contenido de cada tema

**User Story:** Como estudiante, quiero leer el contenido de cada tema con buena legibilidad y estructura visual, para comprender los conceptos de manera efectiva.

#### Acceptance Criteria

1. WHEN un Topic es seleccionado, THE Content_Viewer SHALL renderizar el contenido con jerarquía tipográfica clara: títulos `h2`, subtítulos `h3`, párrafos, listas y bloques de código o pseudocódigo donde corresponda.
2. THE Content_Viewer SHALL aplicar el sistema de colores de Evolution Fit: fondo `var(--card-bg)`, texto `var(--text)`, acentos `var(--primary)`.
3. WHEN el contenido de un Topic incluye una tabla (ej. tabla de decisión, tabla de relación gestión/técnico), THE Content_Viewer SHALL renderizarla con estilos consistentes con el diseño de la plataforma.
4. WHEN el contenido de un Topic incluye pseudocódigo o LDP, THE Content_Viewer SHALL mostrarlo en un bloque con fuente monoespaciada y fondo diferenciado (`var(--card-bg2)`).
5. THE Content_Viewer SHALL mostrar botones de navegación "Tema anterior" y "Tema siguiente" al final de cada Topic para permitir lectura secuencial.
6. WHEN el Topic pertenece al USB_Block, THE Content_Viewer SHALL mostrar tarjetas visuales con íconos para cada concepto clave (ej. 🔍 Diseño centrado, 🔄 Design Thinking, 🎨 Diseño visual) usando emojis o íconos FontAwesome.
7. WHEN el Topic "Metodología Design Thinking" es seleccionado, THE Content_Viewer SHALL mostrar las 6 etapas (Empatizar, Definir, Idear, Prototipar, Testear, Implementar) como tarjetas numeradas en secuencia horizontal.

---

### Requirement 4: Búsqueda de contenido

**User Story:** Como estudiante, quiero buscar términos específicos dentro del módulo, para encontrar rápidamente el tema que necesito sin recorrer toda la estructura.

#### Acceptance Criteria

1. THE Learn_Module SHALL incluir una Search_Bar visible en la parte superior del módulo.
2. WHEN el usuario escribe en la Search_Bar, THE Learn_Module SHALL filtrar y mostrar en tiempo real los Topics de ambos bloques cuyo título o contenido contenga el texto ingresado.
3. WHEN la búsqueda no produce resultados, THE Learn_Module SHALL mostrar un mensaje indicando que no se encontraron temas relacionados.
4. WHEN el usuario borra el texto de la Search_Bar, THE Learn_Module SHALL restaurar la vista completa del Topic_Navigator.
5. IF el texto ingresado en la Search_Bar tiene menos de 2 caracteres, THEN THE Learn_Module SHALL ignorar la búsqueda y mantener la vista actual.

---

### Requirement 5: Seguimiento de progreso de lectura

**User Story:** Como estudiante, quiero que la plataforma recuerde qué temas ya leí, para saber cuánto he avanzado en el módulo y retomar donde lo dejé.

#### Acceptance Criteria

1. WHEN un usuario autenticado visualiza un Topic por primera vez, THE Progress_Tracker SHALL registrar ese Topic como visitado en el almacenamiento local del navegador asociado al ID del usuario.
2. THE Learn_Module SHALL mostrar una barra de progreso por bloque que indique el porcentaje de Topics visitados sobre el total de Topics de ese bloque.
3. WHEN el usuario regresa al Learn_Module en una sesión posterior, THE Progress_Tracker SHALL restaurar el estado de Topics visitados desde el almacenamiento local.
4. THE Learn_Module SHALL mostrar el último Topic visitado como sugerencia de continuación al cargar el módulo.
5. WHEN el usuario ha visitado todos los Topics de ambos bloques, THE Learn_Module SHALL mostrar un mensaje de felicitación y otorgar 100 puntos EF al usuario.

---

### Requirement 6: Integración visual con Evolution Fit

**User Story:** Como usuario de la plataforma, quiero que el módulo de aprendizaje tenga el mismo aspecto visual que el resto de Evolution Fit, para mantener una experiencia coherente.

#### Acceptance Criteria

1. THE Learn_Module SHALL utilizar exclusivamente las variables CSS definidas en `styles.css` (colores, tipografía, radios, sombras) sin introducir nuevos valores de diseño.
2. THE Learn_Module SHALL ser completamente responsivo: en pantallas menores a 768px, THE Topic_Navigator SHALL colapsar en un menú desplegable en lugar de mostrarse como barra lateral.
3. THE Learn_Module SHALL utilizar los componentes existentes de la plataforma: `.card`, `.btn`, `.badge`, `.progress-bar`, `.tabs` y `.section-title`.
4. WHEN el Learn_Module se renderiza, THE Learn_Module SHALL aplicar una animación de entrada consistente con el resto de páginas de la plataforma.
5. THE Learn_Module SHALL mostrar el ícono `fas fa-book-open` en la barra de navegación junto al texto "Aprende".

---

### Requirement 7: Accesibilidad

**User Story:** Como usuario con necesidades de accesibilidad, quiero que el módulo sea navegable con teclado y compatible con lectores de pantalla, para poder acceder al contenido sin barreras.

#### Acceptance Criteria

1. THE Learn_Module SHALL asignar atributos `aria-label` descriptivos a todos los controles interactivos (botones de navegación, Search_Bar, ítems del Topic_Navigator).
2. THE Topic_Navigator SHALL ser completamente navegable mediante teclado usando las teclas Tab, Enter y Escape.
3. WHEN un Topic es seleccionado, THE Content_Viewer SHALL recibir el foco del teclado para que los lectores de pantalla anuncien el nuevo contenido.
4. THE Learn_Module SHALL mantener una relación de contraste de color mínima de 4.5:1 entre el texto y el fondo en todos sus componentes, conforme a WCAG 2.1 nivel AA.
5. THE Content_Viewer SHALL incluir atributos `role` y `aria-live` apropiados para anunciar cambios de contenido dinámico a tecnologías de asistencia.

---

### Requirement 8: Contenido específico del bloque Usabilidad

**User Story:** Como estudiante de ingeniería de software, quiero acceder a los conceptos clave de usabilidad con ejemplos visuales y prácticos, para aplicarlos directamente en mi proyecto.

#### Acceptance Criteria

1. THE USB_Block SHALL presentar los 3 factores de usabilidad (Eficacia, Eficiencia, Satisfacción) como tarjetas visuales con íconos diferenciados al inicio del bloque.
2. THE USB_Block SHALL incluir una sección "Ideas listas para tu proyecto" con una lista de 12 puntos accionables extraídos directamente del documento, presentados como checklist interactivo.
3. WHEN el usuario marca un ítem del checklist como completado, THE Learn_Module SHALL guardar ese estado en localStorage asociado al ID del usuario.
4. THE USB_Block SHALL mostrar las 6 etapas de Design Thinking (Empatizar → Definir → Idear → Prototipar → Testear → Implementar) como un diagrama de flujo horizontal con flechas entre etapas.
5. THE USB_Block SHALL incluir una sección de conclusión con el mensaje destacado: "Un buen sistema no es el más complejo, sino el más fácil de usar."
6. WHEN el usuario completa el checklist de "Ideas para tu proyecto" al 100%, THE Learn_Module SHALL mostrar un badge de logro "Experto en Usabilidad" y otorgar 50 puntos EF adicionales.
