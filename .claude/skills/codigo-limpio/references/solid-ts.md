# SOLID en TypeScript y Astro

Cada principio con el olor que lo delata, el arreglo y el coste de aplicarlo mal.

---

## S — Responsabilidad única

> Un módulo debe tener un único motivo para cambiar.

**Olor:** el frontmatter de un `.astro` declara los datos, los transforma y
además decide clases de Tailwind. Tres motivos de cambio (contenido, negocio,
diseño) en un fichero.

```astro
---
// ❌ datos + transformación + presentación
const promos = [{ titulo: "Edificio A", fotos: [/* 40 líneas */] }];
const srcset = promos[0].fotos.map(f => `${f.url} ${f.ancho}w`).join(", ");
---
<img srcset={srcset} class="w-full rounded-lg" />
```

```astro
---
// ✅ el componente solo presenta
import { promociones, fotoSrcset } from "../data/promociones";
const { promocion } = Astro.props;
---
<img srcset={fotoSrcset(promocion.portada)} class="w-full rounded-lg" />
```

Los datos cambian en `src/data`, el formato en una función pura testeable, el
diseño en el marcado. Cada cambio toca un sitio.

**Mal aplicado:** partir un componente de 40 líneas en seis ficheros de siete.
Cohesión también es una virtud: lo que cambia junto vive junto.

---

## O — Abierto a extensión, cerrado a modificación

> Añadir un caso no debería obligar a editar el código que ya funciona.

**Olor:** un `switch` que crece con cada sección nueva.

```ts
// ❌ cada sección nueva edita esta función
function claseSeccion(tipo: string) {
  switch (tipo) {
    case "hero": return "py-24 bg-blue-900";
    case "galeria": return "py-12";
    case "contacto": return "py-16 bg-orange-500";
  }
}
```

```ts
// ✅ añadir una sección es añadir una entrada de datos
const ESTILOS_SECCION = {
  hero:     "py-24 bg-blue-900",
  galeria:  "py-12",
  contacto: "py-16 bg-orange-500",
} as const satisfies Record<string, string>;

type TipoSeccion = keyof typeof ESTILOS_SECCION;
```

En Astro la vía natural de extensión es la composición con `<slot />`:
`SectionContainer` aporta el ancho y el espaciado, el contenido lo pone quien
lo usa, sin que `SectionContainer` conozca ningún caso concreto.

**Mal aplicado:** puntos de extensión para variantes que no existen. Espera al
tercer caso real antes de generalizar.

---

## L — Sustitución de Liskov

> Donde encaja el tipo base debe encajar cualquier subtipo, sin comprobaciones.

**Olor:** un tipo con campos opcionales que cada consumidor tiene que
comprobar, y combinaciones imposibles que el compilador permite.

```ts
// ❌ ¿un vídeo con srcset? ¿una foto con duración? el tipo lo permite
interface Medio {
  tipo: "foto" | "video";
  anchos?: Record<number, string>;
  duracion?: number;
}
```

```ts
// ✅ unión discriminada: cada variante es completa y sustituible
type Medio =
  | { tipo: "foto";  alt: string; anchos: Record<number, string> }
  | { tipo: "video"; alt: string; duracion: number; poster: string };

// El compilador obliga a cubrir ambos casos y estrecha los campos solo.
function altDe(m: Medio) { return m.alt; } // válido para cualquier Medio
```

La regla en TS: si al añadir una variante tienes que relajar el tipo base
(volver campos opcionales, ensanchar a `string`), estás rompiendo Liskov.

---

## I — Segregación de interfaces

> Nadie debe depender de lo que no usa.

**Olor:** un componente recibe `promocion` completa y usa dos campos; o una
interfaz `Config` que cada consumidor cumple a medias.

```astro
---
// ❌ acoplado a toda la forma de Promocion
interface Props { promocion: Promocion }
const { promocion } = Astro.props;
---
<h2>{promocion.titulo}</h2>
<p>{promocion.ubicacion}</p>
```

```astro
---
// ✅ depende solo de lo que pinta; reutilizable con cualquier fuente
interface Props { titulo: string; ubicacion: string }
const { titulo, ubicacion } = Astro.props;
---
<h2>{titulo}</h2>
<p>{ubicacion}</p>
```

Ventaja concreta: cambiar `Promocion` deja de romper componentes que nunca
usaron los campos modificados.

**Matiz:** si un componente usa ocho de los diez campos, pasar el objeto es
más legible que ocho props sueltas. El criterio es el acoplamiento real, no un
número.

---

## D — Inversión de dependencias

> Depende de contratos, no de implementaciones concretas.

**Olor:** un componente importa el fichero de datos directamente. Ya solo sirve
para ese dato: no se puede previsualizar, ni reutilizar en otra página, ni
alimentar desde un CMS.

```astro
---
// ❌ el componente elige su fuente de datos
import { promociones } from "../data/promociones";
---
{promociones.map(p => <article>{p.titulo}</article>)}
```

```astro
---
// ✅ el componente declara qué forma necesita; la página decide de dónde sale
interface Props { promociones: { titulo: string; slug: string }[] }
const { promociones } = Astro.props;
---
{promociones.map(p => <a href={`/promociones/${p.slug}`}>{p.titulo}</a>)}
```

La página (`src/pages/index.astro`) es el sitio correcto para conocer la fuente
concreta: es el punto de composición. Cuando los datos migren a Content
Collections, cambia la página y ningún componente.

---

## Señales de que te has pasado de diseño

- Interfaces con una sola implementación que nunca tendrá otra.
- Ficheros de menos de diez líneas que solo reexportan.
- Capas de indirección que hay que atravesar para entender qué se renderiza.
- Genéricos que nadie parametriza con un segundo tipo.

El objetivo no es cumplir cinco letras: es que el siguiente cambio sea fácil.
Si el diseño hace el cambio más difícil, está mal aunque sea SOLID.
