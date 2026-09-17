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
import type { ImageMetadata } from "astro";

import laFachada from "../assets/promociones/los-altos-de-alcobendas-ii/fachada.jpg";
import laPortal from "../assets/promociones/los-altos-de-alcobendas-ii/portal.jpg";
import laSalon from "../assets/promociones/los-altos-de-alcobendas-ii/salon.jpg";
import laDormitorioPrincipal from "../assets/promociones/los-altos-de-alcobendas-ii/dormitorio-principal.jpg";
import laDormitorioInfantil from "../assets/promociones/los-altos-de-alcobendas-ii/dormitorio-infantil.jpg";
import laBano from "../assets/promociones/los-altos-de-alcobendas-ii/bano.jpg";

import pnConjunto from "../assets/promociones/el-pinar-de-prado-norte/conjunto.jpg";
import pnAcceso from "../assets/promociones/el-pinar-de-prado-norte/acceso.jpg";
import pnSalon from "../assets/promociones/el-pinar-de-prado-norte/salon.jpg";
import pnCocina from "../assets/promociones/el-pinar-de-prado-norte/cocina.jpg";
import pnDormitorioPrincipal from "../assets/promociones/el-pinar-de-prado-norte/dormitorio-principal.jpg";
import pnDormitorioEscritorio from "../assets/promociones/el-pinar-de-prado-norte/dormitorio-escritorio.jpg";
import pnBano from "../assets/promociones/el-pinar-de-prado-norte/bano.jpg";
import pnVestidor from "../assets/promociones/el-pinar-de-prado-norte/vestidor.jpg";

export interface Foto {
  alt: string;
  /**
   * Original importado de `src/assets/`, no una URL.
   *
   * Antes las fotos se enlazaban al WordPress anterior, que vive en el mismo
   * dominio al que se despliega este sitio: al mover el DNS a Netlify,
   * `/wp-content/uploads/…` pasaba a ser un 404 y desaparecían todas. Ahora son
   * parte del repo, así que un fichero que falte rompe el build en lugar de la
   * web en producción.
   *
   * Importarlas (en vez de dejarlas en `public/`) es lo que permite a Astro
   * generar AVIF y WebP a cada ancho, y conocer las dimensiones del original
   * para reservar el hueco y evitar el salto de layout.
   */
  src: ImageMetadata;
}

export type EstadoPromocion = "entregado" | "en-obras";

export interface Promocion {
  slug: string;
  nombre: string;
  ubicacion: string;
  estado: EstadoPromocion;
  /** Año de entrega si está entregada, o previsión de entrega si está en obras. */
  year: string;
  viviendas: string;
  /**
   * Periodo de obra ("2021 – 2023"). Opcional: de las promociones antiguas no
   * consta y la ficha omite la fila en vez de inventarse un dato.
   * TODO(negocio): rellenar cuando se confirmen las fechas reales de obra.
   */
  periodo?: string;
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
        src: laFachada,
      },
      {
        alt: "Portal de acceso al edificio, con fachada de madera y piedra",
        src: laPortal,
      },
      {
        alt: "Salón-comedor con cocina abierta y salida a la terraza",
        src: laSalon,
      },
      {
        alt: "Dormitorio principal con armario empotrado",
        src: laDormitorioPrincipal,
      },
      {
        alt: "Dormitorio infantil con zona de estudio y armario alto",
        src: laDormitorioInfantil,
      },
      {
        alt: "Baño completo con ducha y mueble suspendido",
        src: laBano,
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
        src: pnConjunto,
      },
      {
        alt: "Acceso a la promoción desde la calle, con las viviendas al fondo",
        src: pnAcceso,
      },
      {
        alt: "Salón-comedor diáfano con salida al jardín y a la piscina",
        src: pnSalon,
      },
      {
        alt: "Cocina abierta con isla y zona de office",
        src: pnCocina,
      },
      {
        alt: "Dormitorio principal con cabecero de madera y salida al jardín",
        src: pnDormitorioPrincipal,
      },
      {
        alt: "Dormitorio con zona de escritorio y vistas al jardín",
        src: pnDormitorioEscritorio,
      },
      {
        alt: "Baño principal con doble lavabo, ducha y bañera exenta",
        src: pnBano,
      },
      {
        alt: "Vestidor del dormitorio en suite",
        src: pnVestidor,
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
