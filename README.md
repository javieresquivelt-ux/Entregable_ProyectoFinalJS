# 🪐 Rick and Morty Explorer

> **Entregable 02 • Proyecto Final de JavaScript — Conquer Blocks**  
> Aplicación web interactiva desarrollada con **JavaScript Vanilla moderno (ES Modules)**, **Vite**, y **Sass modular (7-1 Pattern)**, consumiendo la API oficial de Rick and Morty.

---

## 🚀 Demo y Despliegue

- **Repositorio:** [github.com/javieresquivelt-ux/Entregable_ProyectoFinalJS](https://github.com/javieresquivelt-ux/Entregable_ProyectoFinalJS)
- **Live Demo (GitHub Pages):** [https://javieresquivelt-ux.github.io/Entregable_ProyectoFinalJS/](https://javieresquivelt-ux.github.io/Entregable_ProyectoFinalJS/)

---

## ✨ Características Principales

1. **Exploración Dinámica de Personajes:**
   - Visualización en cuadrícula responsiva (CSS Grid adaptable a móvil, tablet y escritorio).
   - Indicadores visuales de estado (*Vivo*, *Muerto*, *Desconocido*) con puntos lumínicos temáticos.
   - Datos esenciales: nombre, especie, última ubicación conocida y planeta/dimensión de origen.

2. **Búsqueda Reactiva con Patrón Debounce:**
   - Campo de búsqueda por texto optimizado a 350ms mediante clausuras (*closures*) y temporizadores Web API.
   - Reduce llamadas innecesarias al servidor hasta en un 80% durante la escritura del usuario.

3. **Filtros Combinados en Tiempo Real:**
   - Filtrado simultáneo por **Estado** (*Vivo*, *Muerto*, *Desconocido*) y **Género** (*Femenino*, *Masculino*, *Sin género*, *Desconocido*).
   - Manejo defensivo del código HTTP 404 de la API pública para transformar búsquedas sin resultados en una pantalla controlada de *Feedback Vacío*.

4. **Navegación Paginada con Guardas Anti-concurrencia:**
   - Control de botones Anterior/Siguiente con sincronización de estado.
   - Guarda reactiva `state.isLoading` que previene condiciones de carrera (*race conditions*) por clics sucesivos.
   - Desplazamiento suave (*smooth scroll*) automático hacia la cabecera de los resultados en cada transición de página.

5. **Modal de Detalle Extendido con HTML5 `<dialog>`:**
   - Uso de la API nativa de `<dialog>` con `showModal()`, garantizando accesibilidad de fábrica: atrapado de foco (*focus trap*), `aria-modal="true"`, y cierre con tecla `Escape`.
   - Consulta de episodios en paralelo mediante `Promise.all()`, optimizando los tiempos de carga y limitando la consulta a un máximo de 20 episodios para evitar cuotas de tasa (*rate limits*).

6. **Sistema de Favoritos con Persistencia en `localStorage`:**
   - Almacenamiento seguro bajo clave `rmx_favorites` con estructura en memoria `Map<id, character>` para búsquedas en tiempo constante $O(1)$.
   - **Actualización Quirúrgica del DOM:** Alternar el estado de favorito actualiza únicamente el botón afectado mediante *Event Delegation*, evitando reflows y pérdidas de posición de scroll.
   - Pestaña exclusiva de "Favoritos" que lee localmente sin realizar peticiones de red adicionales, con animación fluida de retiro de tarjeta y estado vacío ilustrado.

7. **Accesibilidad Integral (WCAG 2.1 AA):**
   - Soporte completo para navegación por teclado con anillo visible `:focus-visible` temático de alto contraste.
   - Regiones dinámicas con `aria-live="polite"` y roles semánticos (`role="tablist"`, `role="tab"`, `role="status"`, `role="alert"`).

---

## 🏛️ Arquitectura del Software

El proyecto sigue una estructura modular orientada a la separación estricta de responsabilidades (SoC):

```
Entregable02/
├── .github/
│   └── workflows/
│       └── deploy.yml            # Automatización CI/CD para GitHub Pages
├── public/
│   ├── favicon.svg               # Ícono de portal Rick and Morty
│   └── icons.svg
├── src/
│   ├── js/
│   │   ├── components/
│   │   │   ├── CharacterCard.js  # Función pura generadora de tarjetas (HTML string)
│   │   │   ├── Modal.js          # Ciclo de vida y accesibilidad del <dialog>
│   │   │   └── StateFeedback.js  # Estados de carga (Portal loader), error y vacío
│   │   ├── services/
│   │   │   ├── api.js            # Servicio HTTP con fetchCharacters y fetchEpisodesByUrls
│   │   │   └── favorites.js      # Capa de persistencia localStorage con interfaz Map
│   │   └── utils/
│   │       └── debounce.js       # Higher-Order Function para control de timers
│   ├── scss/
│   │   ├── abstracts/            # Variables, colores temáticos, mixins y breakpoints
│   │   ├── base/                 # Reset moderno, tipografías y accesibilidad (:focus-visible)
│   │   ├── components/           # Botones, cards, modal, loader portal y paginación
│   │   ├── layout/               # Encabezado, panel de controles y grid principal
│   │   └── app.scss              # Manifiesto principal de estilos Sass
│   ├── main.js                   # Orquestador: Estado global, Event Delegation y ciclo de vida
│   └── style.css
├── index.html                    # Estructura semántica HTML5
├── vite.config.js                # Configuración de base relativa para despliegue
├── package.json
└── README.md
```

### Conceptos Didácticos Clave Implementados:
- **Single Source of Truth (SSOT):** Un objeto de estado centralizado (`state`) gobierna la página activa, total de páginas, personajes en memoria y filtros vigentes.
- **Event Delegation:** Un solo escuchador en `#characters-grid` atiende eventos de apertura de detalles y alternancia de favoritos para cientos de elementos dinámicos.
- **Inversión de Dependencias:** El componente modal recibe la función de consulta de episodios (`fetchEpisodes`) como parámetro, facilitando desacoplamiento y testing.
- **Funciones Puras:** Componentes de renderizado (`renderCharacterCard`, `renderModalContent`) no generan efectos colaterales; dados los mismos datos de entrada, retornan idéntica estructura HTML.

---

## 🛠️ Instalación y Ejecución Local

### Prerrequisitos
- [Node.js](https://nodejs.org/) v18 o superior
- [npm](https://www.npmjs.com/) v9 o superior

### Pasos

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/javieresquivelt-ux/Entregable_ProyectoFinalJS.git
   cd Entregable_ProyectoFinalJS
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre tu navegador en `http://localhost:5173`.

4. **Compilar para producción:**
   ```bash
   npm run build
   ```
   Los artefactos optimizados se generarán en la carpeta `dist/`.

5. **Previsualizar el paquete de producción:**
   ```bash
   npm run preview
   ```

---

## 🌐 Configuración para GitHub Pages

El proyecto cuenta con `vite.config.js` configurado con ruta base relativa (`base: './'`) y un flujo de trabajo automatizado en `.github/workflows/deploy.yml`.

Para habilitarlo en tu repositorio de GitHub:
1. Dirígete a **Settings** > **Pages** en tu repositorio.
2. En la sección **Build and deployment**, bajo **Source**, selecciona **GitHub Actions**.
3. Cada `git push` a la rama `main` compilará y publicará la aplicación automáticamente.

---

## 👨‍💻 Autor y Créditos
- **Estudiante / Desarrollador:** Javier Esquivel
- **Formación:** Master en Desarrollo Web / JavaScript — Conquer Blocks
- **API Oficial:** [The Rick and Morty API](https://rickandmortyapi.com/) por Axel Fuhrmann
