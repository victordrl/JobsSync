import {
  createUser,
  createCandidateProfile,
  createSkillCatalogEntry,
  createOferta,
  createPregunta,
  createAplicacion,
  createRespuesta,
  ROLES,
  MODALIDADES,
  TIPOS_PREGUNTA,
} from "./schemas";
import { SKILLS_CATALOG } from "./skills-catalog";

export function getSeedUsers() {
  return [
    createUser({
      id: "user-admin-1",
      email: "admin",
      password: "admin",
      rol: ROLES.RECLUTADOR,
      nombre: "Admin Reclutador",
    }),
    createUser({
      id: "user-carlos-1",
      email: "carlos",
      password: "carlos",
      rol: ROLES.CANDIDATO,
      nombre: "Carlos Maurera",
    }),
  ];
}

export function getSeedProfiles() {
  return [
    createCandidateProfile({
      id: "profile-carlos-1",
      userId: "user-carlos-1",
      filename: "CV_Carlos_Maurera.pdf",
      nombre: "Carlos Maurera",
      email: "carlos.m@email.com",
      telefono: "+58 412-1234567",
      profesion: "Ingeniero de Sistemas",
      experiencia_anios: 5,
      hard_skills: [
        { nombre: "Python", categoria: "backend", nivel: "avanzado" },
        { nombre: "NLP", categoria: "ia", nivel: "intermedio" },
        { nombre: "FastAPI", categoria: "backend", nivel: "intermedio" },
        { nombre: "PostgreSQL", categoria: "backend", nivel: "intermedio" },
        { nombre: "Docker", categoria: "devops", nivel: "básico" },
      ],
      soft_skills: [
        { nombre: "Trabajo en equipo", nivel: "alto" },
        { nombre: "Comunicación efectiva", nivel: "alto" },
        { nombre: "Resolución de problemas", nivel: "alto" },
      ],
      processorVersion: "gemini-simulado",
      processingTime: 2340,
    }),
  ];
}

export function getSeedSkillsCatalog() {
  return SKILLS_CATALOG.map((s) =>
    createSkillCatalogEntry({
      nombre: s.nombre,
      categoria: s.categoria,
      veces_usada: s.veces_usada,
    })
  );
}

export function getSeedOfertas(recrutadorId = "user-admin-1") {
  return [
    createOferta({
      id: "oferta-1",
      reclutadorId: recrutadorId,
      titulo: "Desarrollador Python Backend (IA)",
      empresa: "Tech Solutions",
      ubicacion: "Caracas (Híbrido)",
      modalidad: MODALIDADES.HIBRIDO,
      salario: "$2500 - $3500 mensuales",
      descripcion:
        "Buscamos un desarrollador backend con experiencia en Python y frameworks modernos. Conocimiento en IA/ML es un plus.",
      skills: ["Python", "FastAPI", "PostgreSQL"],
      requisitos: [
        "Experiencia mínima 3 años",
        "Título universitario en informática",
        "Inglés intermedio",
      ],
      preguntas: [
        createPregunta({
          id: "p1",
          texto: "¿Tienes experiencia trabajando en equipo?",
          tipo: TIPOS_PREGUNTA.SI_NO,
        }),
        createPregunta({
          id: "p2",
          texto: "¿Cuál es tu expectativa salarial?",
          tipo: TIPOS_PREGUNTA.TEXTO,
        }),
        createPregunta({
          id: "p3",
          texto: "¿Cuándo podrías incorporarte?",
          tipo: TIPOS_PREGUNTA.TEXTO,
        }),
        createPregunta({
          id: "p4",
          texto: "¿Has liderado proyectos anteriormente?",
          tipo: TIPOS_PREGUNTA.SI_NO,
        }),
      ],
    }),
    createOferta({
      id: "oferta-2",
      reclutadorId: recrutadorId,
      titulo: "Frontend Developer",
      empresa: "Web Creativos",
      ubicacion: "Remoto",
      modalidad: MODALIDADES.REMOTO,
      salario: "$2000 - $3000 mensuales",
      descripcion:
        "Buscamos un frontend developer con experiencia en React para construir interfaces modernas.",
      skills: ["React", "Tailwind CSS", "JavaScript"],
      requisitos: [
        "Experiencia mínima 2 años con React",
        "Conocimiento de HTML/CSS avanzado",
        "Trabajo en equipo",
      ],
      preguntas: [
        createPregunta({
          id: "p1",
          texto: "¿Tienes experiencia trabajando en equipo?",
          tipo: TIPOS_PREGUNTA.SI_NO,
        }),
        createPregunta({
          id: "p2",
          texto: "¿Cuál es tu nivel de inglés?",
          tipo: TIPOS_PREGUNTA.MULTIPLE,
          opciones: ["Básico (A1-A2)", "Intermedio (B1-B2)", "Avanzado (C1-C2)"],
        }),
        createPregunta({
          id: "p3",
          texto: "¿Disponibilidad para viajar?",
          tipo: TIPOS_PREGUNTA.SI_NO,
        }),
      ],
    }),
  ];
}

export function getSeedAplicaciones() {
  return [
    createAplicacion({
      id: "apl-carlos-oferta1",
      candidatoId: "profile-carlos-1",
      ofertaId: "oferta-1",
      respuestas: [
        createRespuesta({
          preguntaId: "p1",
          pregunta: "¿Tienes experiencia trabajando en equipo?",
          tipo: TIPOS_PREGUNTA.SI_NO,
          respuesta: "Sí",
        }),
        createRespuesta({
          preguntaId: "p2",
          pregunta: "¿Cuál es tu expectativa salarial?",
          tipo: TIPOS_PREGUNTA.TEXTO,
          respuesta: "$2500 - $3000 mensuales",
        }),
        createRespuesta({
          preguntaId: "p3",
          pregunta: "¿Cuándo podrías incorporarte?",
          tipo: TIPOS_PREGUNTA.TEXTO,
          respuesta: "Inmediatamente",
        }),
        createRespuesta({
          preguntaId: "p4",
          pregunta: "¿Has liderado proyectos anteriormente?",
          tipo: TIPOS_PREGUNTA.SI_NO,
          respuesta: "Sí",
        }),
      ],
      score: 92,
      scoreDetalle: { skills: 85, experiencia: 90, softSkills: 100 },
    }),
  ];
}
