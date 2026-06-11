import { getSeedProfiles, getSeedAplicaciones } from "./seed-data";

const seedProfiles = getSeedProfiles();
const seedAplicaciones = getSeedAplicaciones();

export const perfilCandidato = seedProfiles[0]
  ? {
      nombre: seedProfiles[0].nombre,
      email: seedProfiles[0].email,
      educacion: seedProfiles[0].hard_skills?.map((s) => s.nombre).join(", ") || "",
      universidad: "Universidad Gran Mariscal de Ayacucho",
      periodo: "2018 - 2025",
    }
  : {};

export const candidatos = seedProfiles.map((p) => ({
  id: parseInt(p.id.slice(-4), 16) || 1,
  nombre: p.nombre,
  titulo: p.profesion,
  iniciales: p.nombre
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2),
  bgColor: "bg-blue-100",
  skills: p.hard_skills.map((s) => s.nombre),
  score: 92,
  scoreColor: "green",
  ofertaId: 1,
}));

export const respuestasCandidatos = seedAplicaciones.map((a) => ({
  candidatoId: parseInt(a.candidatoId.slice(-4), 16) || 1,
  ofertaId: parseInt(a.ofertaId.slice(-4), 16) || 1,
  respuestas: a.respuestas.map((r) => ({
    preguntaId: r.preguntaId,
    pregunta: r.pregunta,
    tipo: r.tipo,
    respuesta: r.respuesta,
  })),
}));
