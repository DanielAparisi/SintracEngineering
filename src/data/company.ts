/**
 * Fuente única de verdad de los datos de la empresa.
 *
 * Todo lo que se muestre al usuario o se publique como dato estructurado
 * (JSON-LD, llms.txt, footer, sección de contacto) debe leerse de aquí.
 * Si un dato de empresa aparece escrito a mano en un `.astro`, es un bug.
 */

const FOUNDING_YEAR = 2003;

export const company = {
  name: "Sintrac Engineering",
  legalName: "Sintrac Engineering",
  url: "https://sintracengineering.es",
  foundingYear: FOUNDING_YEAR,

  /**
   * Años de experiencia calculados en tiempo de build. Antes estaba escrito a
   * mano como "19" en seis sitios y como "22" en otro; ahora no puede
   * desincronizarse ni quedarse desfasado al cambiar de año.
   */
  get yearsOfExperience(): number {
    return new Date().getFullYear() - FOUNDING_YEAR;
  },

  // TODO(negocio): confirmar la dirección fiscal/comercial correcta.
  // El proyecto tenía dos direcciones contradictorias: "San Sebastián de los
  // Reyes" (footer, llms.txt, JSON-LD del layout) y esta, la única completa y
  // geocodificable, que estaba en la sección de contacto. Se toma esta como
  // canónica; si la buena es la de SSR, se corrige aquí y cambia en todas partes.
  address: {
    street: "Av. de la Zaporra, 147",
    postalCode: "28100",
    locality: "Alcobendas",
    region: "Madrid",
    country: "ES",
    countryName: "España",
  },

  geo: {
    latitude: 40.5341,
    longitude: -3.6395,
  },

  // TODO(negocio): sustituir por el teléfono real. Publicar un placeholder en
  // el JSON-LD es peor que no publicar teléfono: Google lo indexa como dato
  // de contacto del negocio.
  phone: {
    e164: "+34000000000",
    display: "+34 000 000 000",
  },

  email: "info@sintracengineering.es",

  /**
   * Obras entregadas. Estaba escrito como "+50" en el hero y "+3" en el
   * collage del banner, mientras el texto de "Nuestra historia" dice "más de
   * cincuenta obras entregadas". Se toma la cifra del texto como buena.
   * TODO(negocio): confirmar el número real de obras entregadas.
   */
  deliveredProjects: "+50",

  openingHours: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const,
    daysLabel: "Lunes – Viernes",
    opens: "09:00",
    closes: "18:00",
  },

  /** Zona principal de actuación y municipios de influencia. */
  areaServed: {
    primary: "San Sebastián de los Reyes",
    region: "Norte de la Comunidad de Madrid",
    /** Igual que `region` pero para usar a mitad de frase ("el ..."), sin
     *  destrozar los nombres propios con toLowerCase(). */
    regionInline: "norte de la Comunidad de Madrid",
    municipalities: [
      "Alcobendas",
      "Tres Cantos",
      "Colmenar Viejo",
      "Algete",
      "Corredor del Henares",
    ],
  },

  services: [
    "Obra nueva residencial: construcción de viviendas y edificios de nueva planta",
    "Promociones inmobiliarias: desarrollo y comercialización de proyectos residenciales",
    "Construcción industrial y comercial",
    "Proyectos de arquitectura y gestión integral de obra",
    "Cumplimiento normativo medioambiental en todos los proyectos",
  ],

  values: [
    "Compromiso con la calidad constructiva y los materiales",
    "Responsabilidad medioambiental en cada proyecto",
    "Gestión integral: desde el proyecto hasta la entrega de llaves",
  ],
} as const;

/** Dirección en una línea, para el schema y para textos planos. */
export const formattedAddress =
  `${company.address.street}, ${company.address.postalCode} ` +
  `${company.address.locality}, ${company.address.region}, ${company.address.countryName}`;

/** Descripción corta reutilizada en meta description, og y llms.txt. */
export const shortDescription =
  `Constructora inmobiliaria con más de ${company.yearsOfExperience} años de ` +
  `experiencia en ${company.areaServed.primary}, Madrid. Fundada en ` +
  `${company.foundingYear}, especializada en obra nueva residencial y ` +
  `promociones inmobiliarias en el norte de Madrid.`;

/** Preguntas frecuentes: alimentan a la vez el FAQPage del JSON-LD y llms.txt. */
export const faq = [
  {
    question: "¿Dónde opera Sintrac Engineering?",
    answer:
      `${company.name} opera principalmente en ${company.areaServed.primary} y ` +
      `el ${company.areaServed.regionInline}, incluyendo ` +
      `${company.areaServed.municipalities.join(", ")}.`,
  },
  {
    question: "¿Cuántos años de experiencia tiene Sintrac Engineering?",
    answer:
      `${company.name} fue fundada en ${company.foundingYear} y cuenta con más de ` +
      `${company.yearsOfExperience} años de experiencia en construcción e inmobiliaria.`,
  },
  {
    question: "¿Qué servicios ofrece Sintrac Engineering?",
    answer:
      `${company.name} ofrece obra nueva residencial, promociones inmobiliarias, ` +
      `construcción industrial y gestión integral de proyectos en Madrid.`,
  },
  {
    question: "¿Cómo contactar con Sintrac Engineering?",
    answer: `Puedes contactar con ${company.name} a través de su web oficial: ${company.url}`,
  },
] as const;
