/**
 * Enlaces de navegación del sitio.
 *
 * Fuente única para `Header` y `Footer`: antes cada uno tenía su propia lista
 * escrita a mano, así que añadir una sección eran dos ediciones y una ocasión
 * de que las dos listas dejaran de coincidir.
 *
 * Las rutas empiezan por `/` para que funcionen también desde las fichas de
 * promoción, donde un `#proyectos` suelto no saldría de la página actual.
 */
export interface EnlaceNav {
  href: string;
  texto: string;
}

export const enlacesPrincipales: EnlaceNav[] = [
  { href: "/#proyectos", texto: "Proyectos" },
  { href: "/#nosotros", texto: "Nosotros" },
];

/** Acción principal. Va aparte porque se pinta como botón, no como enlace. */
export const enlaceContacto: EnlaceNav = {
  href: "/#contacto",
  texto: "Contactar",
};
