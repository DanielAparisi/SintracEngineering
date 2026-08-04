# Análisis de escalabilidad — Sintrac Engineering

> Auditoría del estado actual (Astro 5 + Tailwind 4, ~1.078 líneas en `src/`, 1 página, 0 dependencias de runtime).
> **Nada de esto está aplicado**: es un plan de trabajo. Ordenado por impacto/esfuerzo.

## Opinión general

El proyecto está bien planteado para lo que es: una landing estática, rápida por defecto (cero JS de framework),
con muy buen trabajo de SEO semántico para la parte que suele descuidarse — JSON-LD, `llms.txt`, `robots.txt` con
bots de IA explícitos, `prefers-reduced-motion`, `aria-expanded` en el menú. Eso está por encima de la media.

El problema no es la calidad del HTML, es que **todo el proyecto asume que solo habrá una página y un proyecto
inmobiliario**. Los datos viven dentro del JSX, el diseño vive en strings de clases repetidas, y la identidad de la
empresa (dirección, teléfono, años) está copiada en 5 sitios distintos con valores que ya no coinciden entre sí.
En cuanto entren 10 promociones, una segunda página o un formulario de contacto, esto se rompe por costuras
previsibles. Las 10 tareas de abajo atacan exactamente esas costuras.

---

## Top 10

### 1. Falta `site` en `astro.config.mjs` → canonical, Open Graph y sitemap rotos

**Problema.** `astro.config.mjs:6` no define `site`. `Layout.astro:37,55` usa `Astro.url.href` para `og:url` y
`<link rel="canonical">`; sin `site`, en build eso resuelve contra el host de despliegue de forma inconsistente y en
dev apunta a `localhost:4321`. Además `public/robots.txt:35` anuncia `Sitemap: https://sintracengineering.es/sitemap-index.xml`
y **ese fichero no existe** — no está `@astrojs/sitemap` instalado. También se referencia `/og-image.jpg`
(`Layout.astro:42,51`) y en `public/` solo hay `logo.png`: las previews de WhatsApp/LinkedIn salen vacías.

**Por qué escala mal.** Cada página nueva hereda el canonical roto y no aparece en el sitemap. El coste de arreglarlo
crece con el número de rutas.

**Propuesta.**
- `site: "https://sintracengineering.es"` en la config.
- `npx astro add sitemap` y quitar del sitemap las rutas que no toquen.
- Generar un `og-image.jpg` real (1200×630) o borrar las metas que lo referencian.
- Cambiar `Astro.url.href` por `new URL(Astro.url.pathname, Astro.site)`.

**Impacto:** alto · **Esfuerzo:** 30 min

---

### 2. Los datos viven dentro de los componentes → mover a Content Collections

**Problema.** Las promociones son arrays hardcodeados dentro del frontmatter de `ProyectosSection.astro:4-24`
(`finalizados` y `enMarcha`), y el bloque de renderizado de ambos está **duplicado literalmente**
(líneas 41-81 vs 96-136, ~40 líneas idénticas salvo dos etiquetas).

**Por qué escala mal.** Añadir una promoción obliga a tocar un componente de presentación. Con 15 promociones el
fichero pasa de 141 a ~600 líneas. No hay validación: un typo en `viviendas` no falla el build, solo se ve raro en
producción. Y no se puede reutilizar el dato en otra página (detalle, listado, sitemap).

**Propuesta.**
```
src/content.config.ts          → defineCollection + zod schema
src/content/promociones/
  los-altos-alcobendas-ii.md   → frontmatter: estado, año, viviendas, ubicación, imagen…
  el-pinar-prado-norte.md
```
Con un campo `estado: "entregado" | "en-obras"` se filtra con `getCollection()` y **desaparece la duplicación**:
un solo `<PromocionCard>` recibe la promoción y decide la etiqueta. Zod valida en build.

**Impacto:** alto · **Esfuerzo:** 3-4 h

---

### 3. Datos de empresa duplicados y **contradictorios** entre sí

**Problema.** La misma información está escrita a mano en sitios distintos, y ya divergió:

| Dato | Valor A | Valor B |
|---|---|---|
| Dirección | San Sebastián de los Reyes (`Layout.astro:73`, `Footer.astro:66`, `llms.txt`) | Av. de la Zaporra 147, **Alcobendas** (`Ubication.astro:11-15`) |
| Años de experiencia | "más de 19 años" (×6 sitios) | "**+22** Años de trayectoria" (`MainBanner.astro:176`) |
| Proyectos entregados | "+3" (`MainBanner.astro:182`) | 1 en el array de `ProyectosSection` |
| Teléfono | `+34000000000` — **placeholder en producción y en el JSON-LD** (`Ubication.astro:17,65`, `Footer.astro:70`) |

Además hay **dos JSON-LD que describen la misma empresa con `@type` distinto**: `LocalBusiness/ConstructionCompany`
en `Layout.astro:65` y `GeneralContractor` en `Ubication.astro:6`, con direcciones diferentes. Google puede
interpretarlos como dos negocios y repartir la autoridad local.

**Por qué escala mal.** Cada dato nuevo multiplica los puntos de edición. Ya hay incoherencias visibles al usuario.

**Propuesta.** `src/data/company.ts` como fuente única (nombre, NIF, dirección, teléfono, email, `foundingYear`,
horarios, geo, redes). Derivar de ahí: los años (`new Date().getFullYear() - foundingYear`, así no vuelve a
quedar desfasado), el JSON-LD, el footer, la sección de contacto y el `llms.txt`. **Unificar en un único bloque
JSON-LD** con `@graph` y un solo `@id` para el negocio. Y poner el teléfono real o quitarlo — un `+34000000000`
en el schema es peor que no tenerlo.

**Impacto:** alto · **Esfuerzo:** 2-3 h

---

### 4. Sin sistema de diseño: clases de Tailwind copiadas y un color a fuego

**Problema.** `global.css:6-20` define bien los tokens como variables CSS, pero no están registrados en Tailwind,
así que todo el código escribe `text-(--color-text-secondary)` a mano. Consecuencias:
- El estilo de link de nav se repite **8 veces** casi idéntico (`Header.astro:26,33,40,47,89,96,103,110`), y ya
  divergió: unos usan `hover:bg-black/10` y otros `hover:bg-black/5`, unos `text-[var(--color-…)]` y otros
  `text-(--color-…)`.
- El CTA del header lleva el color **hardcodeado inline**: `style="background:#0f2850; color:white;"`
  (`Header.astro:56`) — se salta el token `--color-cta-bg` que existe justo para eso.
- El mismo SVG placeholder de imagen está pegado **7 veces** (5× en `MainBanner.astro`, 2× en `ProyectosSection.astro`).
- La cabecera de sección (`<span>` kicker + `<h2>` grande) se repite en 3 componentes con los mismos clamps.

**Por qué escala mal.** Un cambio de marca obliga a un find-replace en todos los ficheros con riesgo de dejar
huérfanos — como ya pasó con el `#0f2850`.

**Propuesta.**
- Registrar los tokens con `@theme` de Tailwind 4 → usar `text-secondary`, `bg-cta` en vez de la sintaxis de variable.
- Crear `src/components/ui/`: `Button.astro` (variantes `primary`/`outline`), `NavLink.astro`, `SectionHeading.astro`,
  `Badge.astro`, `ImagePlaceholder.astro`.
- Eliminar el `style=` inline del CTA.

**Impacto:** alto · **Esfuerzo:** 4-5 h

---

### 5. Imágenes remotas sin optimizar y sin dimensiones → CLS y dependencia del WordPress viejo

**Problema.** Todas las fotos apuntan al WordPress anterior:
`https://sintracengineering.es/wp-content/uploads/2022/03/IMG_6220.jpg` (`MainBanner.astro:38,66,94,122,150`,
`ProyectosSection.astro:6,17`). Son `<img>` crudos: sin `width`/`height`, sin `loading="lazy"`, sin `decoding`,
sin WebP/AVIF, sin `srcset`. Encima llevan `onerror="this.style.display='none'"` inline — un handler que
además **rompería cualquier CSP** que se añada más adelante.

**Por qué escala mal.** El día que se apague ese WordPress, la web se queda sin fotos. Y con 15 promociones se
descargan 15 JPEG originales de cámara sin redimensionar: la landing pasa de rápida a inutilizable en móvil.

**Propuesta.**
- Descargar los originales a `src/assets/promociones/` y usar `<Image />` / `<Picture />` de `astro:assets`
  (optimización, AVIF/WebP, `width`/`height` automáticos → CLS 0).
- Si se prefiere mantenerlas remotas: declarar `image.domains` en la config para que Astro las procese igual.
- Sustituir el `onerror` inline por el placeholder como fondo CSS del contenedor (ya existe el `<div>` detrás,
  solo hay que dejar de tapar el hueco con JS).

**Impacto:** alto · **Esfuerzo:** 2-3 h

---

### 6. Enlaces de navegación rotos: `#servicios` y `#obras` no existen

**Problema.** El header enlaza a 4 secciones (`Header.astro:31,38` y `:95,102`) y el footer a las mismas
(`Footer.astro:35,42`), pero en `index.astro` solo se montan `MainBanner` (`id="nosotros"`),
`ProyectosSection` (`id="proyectos"`) y `Ubication` (`id="contacto"`). **`#servicios` y `#obras` no llevan a
ningún sitio** — el navegador no hace nada al pulsar. Además el CTA "Contactar" apunta a `#contacto`, que es la
sección de mapa, no un formulario.

**Por qué escala mal.** La navegación está escrita a mano en dos componentes: cada sección nueva son dos ediciones
y una oportunidad más de desincronizar.

**Propuesta.** `src/data/navigation.ts` con el array de enlaces, consumido por `Header` y `Footer`. Y decidir:
o se crean las secciones Servicios/Obras, o se quitan del menú hasta que existan.

**Impacto:** alto (es un bug visible) · **Esfuerzo:** 1 h

---

### 7. El JS del header manipula estilos inline; frágil y sin guardas

**Problema.** `Header.astro:125-157` escucha el scroll y escribe **estilos inline** (`header.style.background`,
`backdropFilter`, `borderColor`) y recorre los links pintando `l.style.color = "#334155"` — un color que **no
está en los tokens**, es un cuarto sitio donde vive la paleta. Son dos `<script>` separados que hacen
`document.querySelector(...) as HTMLElement` sin comprobar `null` (el `as` engaña a TypeScript, no protege en
runtime). El menú móvil no cierra con `Escape`, no atrapa el foco pese a tener `role="dialog"`, y no bloquea el
scroll del body.

**Por qué escala mal.** Los estilos inline ganan a cualquier regla CSS, así que el próximo que intente
tematizar el header no entenderá por qué no le aplica nada. Y el patrón se replicará en cada componente interactivo.

**Propuesta.**
- Una sola clase: `header.classList.toggle("is-scrolled", window.scrollY > 10)` y todo el aspecto en CSS
  (`.is-scrolled { … }`) usando tokens.
- Usar `IntersectionObserver` con un sentinel en lugar del listener de scroll.
- Unificar los dos scripts, añadir guardas `if (!el) return`, cerrar con `Escape`, `aria-current` en el link activo.

**Impacto:** medio-alto · **Esfuerzo:** 2 h

---

### 8. Cero tooling de calidad: sin `astro check`, sin linter, sin formateo, sin CI

**Problema.** `package.json` solo tiene `dev`/`build`/`preview`/`astro`. `tsconfig.json` extiende `astro/tsconfigs/strict`
pero **nadie ejecuta el type-check** (`astro build` no valida los `.astro` sin `astro check`). Por eso pasan
desapercibidos casos como `SectionContaner.astro:2`, que desestructura `Astro.props` **sin interfaz `Props`** —
`class` e `id` son `any`, mientras `Logo.astro` sí la declara. No hay Prettier (el formato es inconsistente:
`ProyectosSection.astro` y `Ubication.astro` van sin formatear frente al resto), ni ESLint, ni GitHub Actions.

**Por qué escala mal.** Sin red de seguridad, cada colaborador nuevo (o cada sesión de IA) introduce deriva de estilo
y errores de tipos que solo se ven en producción.

**Propuesta.**
```jsonc
"scripts": {
  "check":  "astro check",
  "format": "prettier --write .",
  "lint":   "eslint . --ext .js,.ts,.astro"
}
```
`prettier-plugin-astro` + `eslint-plugin-astro`, y un workflow `.github/workflows/ci.yml` que corra
`check` + `build` en cada push. Añadir `interface Props` a `SectionContaner`.

**Impacto:** medio-alto · **Esfuerzo:** 1-2 h

---

### 9. Ficheros muertos y basura en `public/` servida al mundo

**Problema.**
- `src/components/Background.astro` y `src/components/Gallery.astro` están **vacíos (0 bytes)**, y `Background`
  se importa y renderiza en `Layout.astro:3,138`.
- `src/components/HeroSection.astro` (93 líneas, con el `<h1>` de la web) **no se importa en ninguna parte** —
  la página no tiene `<h1>`, solo `<h2>`. Es un problema de SEO y de accesibilidad, no solo de limpieza.
- `public/example.astro`: un `.astro` dentro de `public/` — se sirve como fichero estático crudo, con
  `{...Astro.props}` visible y atributos rotos (`stroke-` sin valor).
- **4 PDFs de exámenes de Álgebra** (`Algebra2526_Pbmas_Tema_1.pdf`, `Notas_Tema_1_Algebra.pdf`, dos parciales)
  en `public/`, públicamente accesibles y desplegados en la web de una constructora.
- `src/assets/astro.svg` y `background.svg` de la plantilla, sin usar.
- `README.md` es el **starter kit de Astro sin tocar** ("🧑‍🚀 Seasoned astronaut? Delete this file").
- `tsconfig.json` usa `"include": ["**/*"]`, que arrastra también `public/`.

**Propuesta.** Borrar los PDFs, `example.astro`, los SVG de plantilla y los dos componentes vacíos. Decidir sobre
`HeroSection`: montarlo en `index.astro` (recomendado — la home necesita un `<h1>`) o eliminarlo. Reescribir el
README con contexto real: qué es, cómo se despliega, dónde se editan las promociones.

**Impacto:** medio · **Esfuerzo:** 1 h

---

### 10. Arquitectura de una sola página: sin rutas, sin formulario, sin i18n

**Problema.** Todo es `index.astro` (16 líneas) y no hay estructura para crecer. No existe página de detalle de
promoción, ni aviso legal / política de privacidad / cookies — **obligatorios en España (LSSI-CE + RGPD)** para
una empresa con web comercial, y el footer no los enlaza. El único "contacto" es un `mailto:` y un iframe de Google
Maps (que además fija cookies de terceros antes de cualquier consentimiento).

**Por qué escala mal.** Cuando pidan "una página por promoción" o "un formulario de presupuesto", hay que decidir
adapter/SSR con la web ya en producción. Es mucho más barato dejar el hueco preparado ahora.

**Propuesta.**
```
src/pages/
  index.astro
  promociones/index.astro          → listado desde la colección
  promociones/[...slug].astro      → getStaticPaths() sobre la colección
  aviso-legal.astro
  politica-privacidad.astro
```
Para el formulario, sin renunciar al estático: **Server Islands** de Astro 5 (`server:defer`) o un endpoint
`src/pages/api/contacto.ts` con `output: "server"` solo en esa ruta, o un servicio externo (Formspree/Resend).
Cargar el iframe de Maps solo tras clic ("facade") para no fijar cookies antes de tiempo. Si algún día hay
inglés, `i18n` de Astro con `src/i18n/es.json` — barato ahora, carísimo con 20 páginas.

**Impacto:** medio (alto si hay plan de crecer) · **Esfuerzo:** 4-6 h

---

## Extra (rápidos, no entran en el top 10)

- **Accesibilidad**: sin *skip link*, sin estilos `:focus-visible` en ningún interactivo, `role="dialog"` sin
  `aria-modal` ni focus trap, el `<span>` "Desde 2003" de `HeroSection:12` usa texto blanco sobre
  `--color-accent-light` (#3B82F6) → contraste ~3.1:1, por debajo de AA.
- **`--color-accent-light` es un azul más saturado, no una versión clara** del acento; el naming engaña.
- **`theme-color` es `#d4af37`** (dorado) en `Layout.astro:28`, resto de la paleta azul marino — sobra de la
  iteración de color anterior.
- **Typo en el nombre del fichero**: `SectionContaner.astro` → `SectionContainer.astro`.
- **`src/Css/` con mayúscula** rompe la convención del resto (`src/components`, `src/layouts`) → `src/styles/`.
- **`global.css` se importa dos veces** (`Layout.astro:6` e `index.astro:3`); basta con el layout.
- **`llms.txt` y el JSON-LD duplican el contenido de la web a mano** — se pueden generar desde `company.ts`
  y la colección, y así no volver a desincronizarse.
- **`Footer.astro` enlaza a GitHub con `target="_blank"` sin `rel="noopener noreferrer"`** (línea 103).

---

## Orden sugerido de ejecución

1. **Sprint 1 — cimientos** (~1 día): #1 (`site`+sitemap), #3 (`company.ts`), #6 (`navigation.ts`), #9 (limpieza), #8 (tooling).
2. **Sprint 2 — contenido** (~1 día): #2 (colecciones), #5 (imágenes).
3. **Sprint 3 — diseño** (~1 día): #4 (design system), #7 (JS del header), accesibilidad.
4. **Sprint 4 — crecimiento** (~1 día): #10 (rutas, legales, formulario).

Los sprints 1 y 2 son los que de verdad cambian la pendiente de la curva de coste: a partir de ahí, añadir una
promoción es crear un `.md`, y cambiar el teléfono es editar una línea.
