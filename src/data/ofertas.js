import { getSeedOfertas } from "./seed-data";

const seedOfertas = getSeedOfertas();

export const ofertas = seedOfertas.map((o, index) => ({
  id: index + 1,
  titulo: o.titulo,
  empresa: o.empresa,
  ubicacion: o.ubicacion,
  modalidad: o.modalidad,
  skills: o.skills,
  score: index === 0 ? 92 : 78,
  color: index === 0 ? "green" : "yellow",
  fortalezas: index === 0
    ? ["Python", "FastAPI", "PostgreSQL", "NLP"]
    : ["React", "JavaScript", "Tailwind CSS"],
  gaps: index === 0 ? ["AWS (Cloud)", "Docker"] : ["TypeScript", "GraphQL"],
  iniciales: o.empresa
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2),
  bgColor: index === 0 ? "bg-slate-900" : "bg-indigo-600",
  ofertaCreadaId: index + 1,
}));
