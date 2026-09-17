---
name: codigo-limpio
description: Aplica buenas prácticas de legibilidad, mantenibilidad y principios SOLID al código TypeScript/Astro. Úsala al escribir código nuevo, al revisar o refactorizar código existente, cuando un fichero o componente se ha vuelto difícil de seguir, o cuando el usuario pida "código limpio", "SOLID", "refactorizar", "mejorar la estructura" o "que esto sea mantenible".
---

# Código limpio y SOLID

Guía de trabajo para que el código de este proyecto sea legible de una pasada y
barato de cambiar dentro de seis meses. No es un checklist que se rellena: es el
criterio con el que se escribe y se revisa.

## Regla base

**El código se escribe una vez y se lee cien.** Ante la duda entre algo
ingenioso y algo obvio, gana lo obvio. Una abstracción solo se paga si elimina
una duplicación real o aísla un cambio que ya sabes que va a ocurrir; si no,
es deuda disfrazada de diseño.

No apliques SOLID como ceremonia. En una web estática de Astro, "inversión de
dependencias" casi nunca significa un contenedor de inyección: significa que un
componente reciba sus datos por `Props` en vez de importarlos él mismo.

## Procedimiento

### 1. Leer antes de tocar
Lee el fichero completo y sus vecinos. Fíjate en cómo nombra, cómo comenta y
cómo separa datos de presentación el código que ya existe, y sigue ese estilo.
En este repo: comentarios en español, JSDoc que explica *por qué*, datos en
`src/data/*.ts`, presentación en `src/components/*.astro`.

### 2. Detectar el problema real
Antes de refactorizar, nombra el síntoma concreto. Señales fiables:

- Un componente `.astro` con el frontmatter lleno de datos literales (URLs,
  textos, listas) mezclados con el marcado.
- Una función que necesita un comentario para explicar *qué* hace (el *qué*
  debería estar en el nombre; el comentario es para el *por qué*).
- El mismo bloque de marcado o la misma transformación de datos copiada en
  tres sitios, con variaciones mínimas.
- Un `if`/`switch` que crece cada vez que se añade un caso de negocio.
- Props booleanas encadenadas (`isHero`, `isCompact`, `isDark`) que se
  combinan entre sí: suelen ser dos componentes disfrazados de uno.
- Firmas que reciben un objeto grande y usan dos campos.

Si no hay síntoma, no hay refactor. Deja el código como está y dilo.

### 3. Aplicar el principio que corresponde
Consulta `references/solid-ts.md` para el detalle de cada principio con
ejemplos en TypeScript y Astro. En resumen:

| Principio | Traducción práctica en este proyecto |
|---|---|
| **S** — Responsabilidad única | Un módulo, un motivo para cambiar. Los datos viven en `src/data`, el formato en helpers puros, el marcado en el componente. Si cambias el diseño y tocas el fichero de datos, están acoplados. |
| **O** — Abierto/cerrado | Añadir una promoción o una sección no debería obligar a editar un `switch`. Extiende por datos y composición (`<slot />`), no editando la lógica existente. |
| **L** — Sustitución de Liskov | Un subtipo cumple el contrato del tipo base. En TS: no ensanches un tipo con campos opcionales que la mitad de los consumidores tiene que comprobar; modela variantes con uniones discriminadas. |
| **I** — Segregación de interfaces | `Props` mínimas. Pasa lo que el componente usa, no el objeto entero "por si acaso". Interfaces pequeñas y específicas antes que una `Config` gigante. |
| **D** — Inversión de dependencias | El componente depende de una forma de dato (`interface Foto`), no de la fuente concreta. Recibe por props; no importa el fichero de datos desde dentro. |

### 4. Refactorizar en pasos verificables
- Un cambio de comportamiento **o** un cambio de estructura, nunca los dos a la vez.
- Mueve código antes de reescribirlo, para que el diff siga siendo legible.
- Tras cada paso, `npm run build` debe pasar. Si no pasa, arréglalo antes de seguir.

### 5. Nombrar bien
- Nombres que digan la intención: `fotoSrcset`, no `getSrc`. `promocionesActivas`, no `data2`.
- Booleanos afirmativos: `tieneGaleria`, no `noTieneGaleria`.
- Coherencia idiomática: en este repo el dominio se nombra en español
  (`promociones`, `anchos`, `foto`) y las APIs técnicas en inglés (`srcset`,
  `width`). Mantén esa frontera.
- El nombre carga el contexto: dentro de `Foto`, `anchos` basta; no `anchosDeFoto`.

### 6. Comentar lo que el código no puede decir
Escribe JSDoc cuando haya una decisión no obvia: por qué se eligió una
estructura, qué restricción externa la impone, qué pasaría si se cambia.
Borra el comentario que solo repite la línea siguiente. Si el código cambia,
actualiza el comentario en el mismo commit o bórralo: un comentario mentiroso
es peor que ninguno.

## Límites

- **No refactorices lo que no te han pedido.** Si ves un problema fuera del
  alcance, menciónalo en una frase y sigue con la tarea.
- **No introduzcas capas ni patrones** (factories, registries, servicios) en un
  sitio estático sin una duplicación real que los justifique.
- **No renombres en masa** ficheros o exports públicos sin avisar: rompe
  imports y enlaces.
- Si el refactor propuesto es grande, describe primero el plan en tres líneas
  y confirma antes de mover cientos de líneas.

## Antes de dar por hecho el trabajo

1. `npm run build` pasa.
2. El diff no contiene cambios de comportamiento no pedidos.
3. Cada fichero tocado sigue teniendo una responsabilidad clara y nombrable.
4. Los comentarios que quedan siguen siendo ciertos.
