/**
 * Promociones inmobiliarias.
 *
 * Extraídas del frontmatter de `ProyectosSection.astro` para que también las
 * pueda consumir el endpoint de `llms.txt` sin duplicarlas a mano.
 *
 * NOTA: esto es un paso intermedio. La tarea #2 de `task.md` propone moverlas a
 * Content Collections (`src/content/promociones/*.md`) con validación zod, lo
 * que sustituirá a este fichero. La forma del dato ya se parece a la final
 * para que esa migración sea directa.
 */

/** Raíz de la biblioteca de medios de WordPress, de donde salen las fotos. */
const MEDIA = "https://sintracengineering.es/wp-content/uploads/";

export interface Foto {
  alt: string;
  /**
   * Dimensiones del original. Fijan la proporción del hueco antes de que la
   * imagen cargue, que es lo que evita el salto de layout en móvil.
   */
  width: number;
  height: number;
  /**
   * Variantes que ya genera WordPress, indexadas por ancho en píxeles. Se
   * guardan las rutas relativas a `MEDIA` para no repetir el dominio 40 veces.
   * De aquí sale el `srcset`: un móvil descarga la de 768 px en vez del
   * original de 2560 px.
   */
  anchos: Record<number, string>;
}

/** `srcset` completo de una foto, con todas sus variantes. */
export const fotoSrcset = (f: Foto) =>
  Object.entries(f.anchos)
    .map(([ancho, ruta]) => `${MEDIA}${ruta} ${ancho}w`)
    .join(", ");

/**
 * `src` de reserva para navegadores sin `srcset`: la mayor variante que no
 * pase de 1024 px, para no colar un original de varios MB como fallback.
 */
export const fotoSrc = (f: Foto) => {
  const anchos = Object.keys(f.anchos).map(Number).sort((a, b) => a - b);
  const elegido = anchos.filter((a) => a <= 1024).pop() ?? anchos[0];
  return `${MEDIA}${f.anchos[elegido]}`;
};

export type EstadoPromocion = "entregado" | "en-obras";

export interface Promocion {
  slug: string;
  nombre: string;
  ubicacion: string;
  estado: EstadoPromocion;
  /** Año de entrega si está entregada, o previsión de entrega si está en obras. */
  year: string;
  viviendas: string;
  descripcion: string;
  /** Fotos propias de la promoción. La primera hace de portada en el listado. */
  galeria: Foto[];
}


export const promociones: Promocion[] = [
  {
    slug: "los-altos-de-alcobendas-ii",
    nombre: "Los Altos de Alcobendas II",
    ubicacion: "Av. de Madrid, 1 · Alcobendas, Madrid",
    estado: "entregado",
    year: "2025",
    viviendas: "15",
    descripcion:
      "Promoción completamente vendida. 15 viviendas con cocina amueblada, salón, 2 dormitorios, 1 baño y 1 aseo. Entrega de llaves completada en plazo y sin incidencias.",
    galeria: [
      {
        alt: "Fachada del edificio de Los Altos de Alcobendas II al atardecer",
        width: 1462,
        height: 1044,
        anchos: {
          768: "2022/06/5-7-768x548.jpg",
          1024: "2022/06/5-7-1024x731.jpg",
          1462: "2022/06/5-7.jpg",
        },
      },
      {
        alt: "Portal de acceso al edificio, con fachada de madera y piedra",
        width: 2000,
        height: 1125,
        anchos: {
          768: "2022/06/portal-768x432.jpg",
          1024: "2022/06/portal-1024x576.jpg",
          1536: "2022/06/portal-1536x864.jpg",
          2000: "2022/06/portal.jpg",
        },
      },
      {
        alt: "Salón-comedor con cocina abierta y salida a la terraza",
        width: 2560,
        height: 1440,
        anchos: {
          768: "2022/06/Salon-768x432.jpg",
          1024: "2022/06/Salon-1024x576.jpg",
          1536: "2022/06/Salon-1536x864.jpg",
          2560: "2022/06/Salon-scaled.jpg",
        },
      },
      {
        alt: "Dormitorio principal con armario empotrado",
        width: 2560,
        height: 1440,
        anchos: {
          768: "2022/06/Habitacion-pincipal-768x432.jpg",
          1024: "2022/06/Habitacion-pincipal-1024x576.jpg",
          1536: "2022/06/Habitacion-pincipal-1536x864.jpg",
          2560: "2022/06/Habitacion-pincipal-scaled.jpg",
        },
      },
      {
        alt: "Dormitorio infantil con zona de estudio y armario alto",
        width: 2560,
        height: 1829,
        anchos: {
          768: "2022/06/Habitacion-infantil-768x549.jpg",
          1024: "2022/06/Habitacion-infantil-1024x732.jpg",
          1536: "2022/06/Habitacion-infantil-1536x1097.jpg",
          2560: "2022/06/Habitacion-infantil-scaled.jpg",
        },
      },
      {
        alt: "Baño completo con ducha y mueble suspendido",
        width: 2560,
        height: 1827,
        anchos: {
          768: "2022/06/Bano-768x548.jpg",
          1024: "2022/06/Bano-1024x731.jpg",
          1536: "2022/06/Bano-1536x1096.jpg",
          2560: "2022/06/Bano-scaled.jpg",
        },
      },
    ],
  },
  {
    slug: "el-pinar-de-prado-norte",
    nombre: "El Pinar de Prado Norte",
    ubicacion: "Camino de los Malatones, 65 · Algete, Madrid",
    estado: "en-obras",
    year: "2026",
    viviendas: "8",
    descripcion:
      "Exclusiva promoción de 8 viviendas independientes de obra nueva. Cada vivienda dispone de salón-comedor, 3 dormitorios, dormitorio en suite con vestidor, 3 baños, lavandería, trastero y 3 plazas de garaje. Jardín privado con acceso a zonas comunitarias ajardinadas con piscina salina.",
    galeria: [
      {
        alt: "Chalets pareados y piscina comunitaria al atardecer",
        width: 1080,
        height: 720,
        anchos: {
          768: "2025/03/Sintrac--768x512.jpg",
          1024: "2025/03/Sintrac--1024x683.jpg",
          1080: "2025/03/Sintrac-.jpg",
        },
      },
      {
        alt: "Acceso a la promoción desde la calle, con las viviendas al fondo",
        width: 1080,
        height: 559,
        anchos: {
          768: "2025/03/Sintrac-2-1-768x398.jpg",
          1024: "2025/03/Sintrac-2-1-1024x530.jpg",
          1080: "2025/03/Sintrac-2-1.jpg",
        },
      },
      {
        alt: "Salón-comedor diáfano con salida al jardín y a la piscina",
        width: 1080,
        height: 600,
        anchos: {
          768: "2025/03/Sintrac-6-768x427.jpg",
          1024: "2025/03/Sintrac-6-1024x569.jpg",
          1080: "2025/03/Sintrac-6.jpg",
        },
      },
      {
        alt: "Cocina abierta con isla y zona de office",
        width: 1080,
        height: 600,
        anchos: {
          768: "2025/03/Sintrac-3-768x427.jpg",
          1024: "2025/03/Sintrac-3-1024x569.jpg",
          1080: "2025/03/Sintrac-3.jpg",
        },
      },
      {
        alt: "Dormitorio principal con cabecero de madera y salida al jardín",
        width: 1080,
        height: 720,
        anchos: {
          768: "2025/03/Sintrac-8-768x512.jpg",
          1024: "2025/03/Sintrac-8-1024x683.jpg",
          1080: "2025/03/Sintrac-8.jpg",
        },
      },
      {
        alt: "Dormitorio con zona de escritorio y vistas al jardín",
        width: 1080,
        height: 721,
        anchos: {
          768: "2025/03/Sintrac-7-768x513.jpg",
          1024: "2025/03/Sintrac-7-1024x684.jpg",
          1080: "2025/03/Sintrac-7.jpg",
        },
      },
      {
        alt: "Baño principal con doble lavabo, ducha y bañera exenta",
        width: 1080,
        height: 800,
        anchos: {
          768: "2025/03/Sintrac-5-768x569.jpg",
          1024: "2025/03/Sintrac-5-1024x759.jpg",
          1080: "2025/03/Sintrac-5.jpg",
        },
      },
      {
        alt: "Vestidor del dormitorio en suite",
        width: 1080,
        height: 1493,
        anchos: {
          741: "2025/03/Sintrac-4-741x1024.jpg",
          768: "2025/03/Sintrac-4-768x1062.jpg",
          1080: "2025/03/Sintrac-4.jpg",
        },
      },
    ],
  },
];

export const finalizados = promociones.filter((p) => p.estado === "entregado");
export const enMarcha = promociones.filter((p) => p.estado === "en-obras");

/** Foto de portada: la primera de la galería. */
export const portada = (p: Promocion) => p.galeria[0];

/**
 * Ruta de la ficha de una promoción, generada por `src/pages/promociones/[slug].astro`.
 *
 * Se centraliza aquí para que el `slug` sea lo único que define la URL: si
 * mañana la ruta pasa a `/obras/` o se añade un idioma, se cambia en un sitio.
 * Barra final incluida porque el build de Astro emite `<slug>/index.html`.
 */
export const promocionPath = (p: Pick<Promocion, "slug">) =>
  `/promociones/${p.slug}/`;
