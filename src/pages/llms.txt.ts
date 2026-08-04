import type { APIRoute } from "astro";
import { company, faq, formattedAddress, shortDescription } from "../data/company";
import {
  finalizados,
  enMarcha,
  promocionPath,
  type Promocion,
} from "../data/promociones";

/**
 * Genera `/llms.txt` en tiempo de build a partir de los mismos datos que usa la
 * web. Antes era un fichero estático en `public/` mantenido a mano, que ya se
 * había desincronizado (años de experiencia, dirección, promociones).
 */

const list = (items: readonly string[]) => items.map((i) => `- ${i}`).join("\n");

/** Incluye la URL de la ficha para que los crawlers de IA lleguen a ella. */
const promocionLine = (p: Promocion, estado: string) => {
  const datos = [p.viviendas && `${p.viviendas} viviendas`, `${estado} ${p.year}`]
    .filter(Boolean)
    .join(" · ");
  return `- [${p.nombre}](${company.url}${promocionPath(p)}) (${p.ubicacion}) — ${datos}`;
};

export const GET: APIRoute = () => {
  const body = `# ${company.name}

> ${shortDescription}

## Quiénes somos

${company.name} es una empresa constructora e inmobiliaria española fundada en ${company.foundingYear}. Operamos principalmente en ${company.areaServed.primary} (SANSE) y el ${company.areaServed.regionInline}. Contamos con más de ${company.yearsOfExperience} años de experiencia en el sector de la construcción y la promoción inmobiliaria.

## Servicios

${list(company.services)}

## Ubicación y área de servicio

- Sede: ${formattedAddress}
- Área de actuación: ${company.areaServed.region}
- Zona de influencia: ${company.areaServed.municipalities.join(", ")}

## Promociones

### Entregadas

${finalizados.map((p) => promocionLine(p, "entregada en")).join("\n") || "- (ninguna publicada)"}

### En marcha

${enMarcha.map((p) => promocionLine(p, "entrega prevista")).join("\n") || "- (ninguna publicada)"}

## Valores y diferenciación

- Más de ${company.yearsOfExperience} años de experiencia en el sector (desde ${company.foundingYear})
${list(company.values)}

## Preguntas frecuentes

${faq.map((f) => `**${f.question}**\n${f.answer}`).join("\n\n")}

## Contacto

- Web: ${company.url}
- Email: ${company.email}
- Teléfono: ${company.phone.display}
- Localización: ${formattedAddress}
- Horario: ${company.openingHours.daysLabel}, ${company.openingHours.opens} – ${company.openingHours.closes}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
