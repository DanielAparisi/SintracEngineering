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
  /** Periodo de obra, tal y como lo publica la web actual ("2022–2023"). */
  periodo?: string;
  /**
   * Nº de viviendas. Opcional: de las promociones antiguas no está publicado en
   * ninguna parte y no se inventa — la ficha oculta el dato si falta.
   */
  viviendas?: string;
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
    periodo: "2023–2024",
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
    slug: "calle-sevilla-11-san-sebastian-de-los-reyes",
    nombre: "C. Sevilla 11",
    ubicacion: "C. Sevilla, 11 · San Sebastián de los Reyes, Madrid",
    estado: "entregado",
    year: "2023",
    periodo: "2022–2023",
    descripcion:
      "Bloque de viviendas en San Sebastián de los Reyes construido entre 2022 y 2023. Terrazas ajardinadas en fachada, patio comunitario con zonas verdes y garaje subterráneo.",
    galeria: [
      {
        alt: "Fachada de C. Sevilla 11, con terrazas ajardinadas",
        width: 800,
        height: 500,
        anchos: {
          800: "2022/01/fachada21.jpg",
        },
      },
      {
        alt: "Terrazas voladas con barandilla de vidrio y jardineras",
        width: 1197,
        height: 1600,
        anchos: {
          766: "2024/10/2WhatsApp-Image-2024-10-11-at-18.21.55-766x1024.jpeg",
          1080: "2024/10/2WhatsApp-Image-2024-10-11-at-18.21.55-1080x1444.jpeg",
          1197: "2024/10/2WhatsApp-Image-2024-10-11-at-18.21.55.jpeg",
        },
      },
      {
        alt: "Fachada interior con terrazas y barandillas metálicas",
        width: 1197,
        height: 1600,
        anchos: {
          766: "2024/10/WhatsApp-Image-2024-10-11-at-18.21.55-766x1024.jpeg",
          1080: "2024/10/WhatsApp-Image-2024-10-11-at-18.21.55-1080x1444.jpeg",
          1197: "2024/10/WhatsApp-Image-2024-10-11-at-18.21.55.jpeg",
        },
      },
      {
        alt: "Patio interior con zona ajardinada y terrazas",
        width: 1197,
        height: 1600,
        anchos: {
          766: "2024/10/6-766x1024.jpeg",
          1080: "2024/10/6-1080x1444.jpeg",
          1197: "2024/10/6.jpeg",
        },
      },
      {
        alt: "Patio comunitario con césped y jardineras",
        width: 1600,
        height: 1197,
        anchos: {
          768: "2024/10/WhatsApp-Image-2024-10-11-at-18.21.54-768x575.jpeg",
          1024: "2024/10/WhatsApp-Image-2024-10-11-at-18.21.54-1024x766.jpeg",
          1600: "2024/10/WhatsApp-Image-2024-10-11-at-18.21.54.jpeg",
        },
      },
      {
        alt: "Acceso al portal desde el patio ajardinado",
        width: 1600,
        height: 1197,
        anchos: {
          768: "2024/10/4-768x575.jpeg",
          1024: "2024/10/4-1024x766.jpeg",
          1600: "2024/10/4.jpeg",
        },
      },
      {
        alt: "Escalera exterior de acceso, con olivo y jardín de grava",
        width: 1600,
        height: 1197,
        anchos: {
          768: "2024/10/3WhatsApp-Image-2024-10-11-at-18.21.55-768x575.jpeg",
          1024: "2024/10/3WhatsApp-Image-2024-10-11-at-18.21.55-1024x766.jpeg",
          1600: "2024/10/3WhatsApp-Image-2024-10-11-at-18.21.55.jpeg",
        },
      },
      {
        alt: "Garaje subterráneo con plazas señalizadas",
        width: 2048,
        height: 1532,
        anchos: {
          768: "2024/03/PHOTO-2024-03-05-19-23-23-768x575.jpg",
          1024: "2024/03/PHOTO-2024-03-05-19-23-23-1024x766.jpg",
          2048: "2024/03/PHOTO-2024-03-05-19-23-23.jpg",
        },
      },
    ],
  },
  {
    slug: "c-valladolid-san-sebastian-de-los-reyes",
    nombre: "C. Valladolid",
    ubicacion: "C. Valladolid · San Sebastián de los Reyes, Madrid",
    estado: "entregado",
    year: "2021",
    periodo: "2020–2021",
    descripcion:
      "Bloque de viviendas en San Sebastián de los Reyes construido entre 2020 y 2021. Edificio en esquina con portal revestido en madera y garaje subterráneo.",
    galeria: [
      {
        alt: "Fachada de C. Valladolid desde la calle, con el acceso al garaje",
        width: 800,
        height: 500,
        anchos: {
          800: "2022/01/2-1.jpg",
        },
      },
      {
        alt: "Vista del edificio en esquina y su entrada de vehículos",
        width: 1920,
        height: 1025,
        anchos: {
          1920: "2022/01/2-4.jpg",
        },
      },
      {
        alt: "Portal de acceso con celosía y revestimiento de madera",
        width: 1920,
        height: 1080,
        anchos: {
          1920: "2022/01/8-1.jpg",
        },
      },
      {
        alt: "Garaje subterráneo diáfano",
        width: 1920,
        height: 1025,
        anchos: {
          1920: "2022/01/3-2.jpg",
        },
      },
    ],
  },
  {
    slug: "c-de-pablo-picasso-5-alcobendas",
    nombre: "C. de Pablo Picasso, 5",
    ubicacion: "C. de Pablo Picasso, 5 · Alcobendas, Madrid",
    estado: "entregado",
    year: "2020",
    periodo: "2018–2020",
    descripcion:
      "Bloque de viviendas en Alcobendas construido entre 2018 y 2020. Fachada ventilada de piedra clara y portal acristalado.",
    galeria: [
      {
        alt: "Fachada de C. de Pablo Picasso, 5, en esquina",
        width: 800,
        height: 500,
        anchos: {
          800: "2022/01/3.jpg",
        },
      },
      {
        alt: "Detalle de la fachada de piedra clara con ventanas oscuras",
        width: 1920,
        height: 1036,
        anchos: {
          1920: "2022/01/IMG_6171.jpg",
        },
      },
      {
        alt: "Portal acristalado del edificio",
        width: 1280,
        height: 1920,
        anchos: {
          1280: "2022/01/IMG_6174.jpg",
        },
      },
    ],
  },
  {
    slug: "fuentiduena-14-alcobendas",
    nombre: "Fuentidueña 14",
    ubicacion: "C. Fuentidueña, 14 · Alcobendas, Madrid",
    estado: "entregado",
    year: "2015",
    periodo: "2014–2015",
    descripcion:
      "Edificio de viviendas en Alcobendas construido entre 2014 y 2015, entre medianeras en el casco urbano.",
    galeria: [
      {
        alt: "Fachada de Fuentidueña 14, entre medianeras",
        width: 800,
        height: 500,
        anchos: {
          800: "2022/01/4.jpg",
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
