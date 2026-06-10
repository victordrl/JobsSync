export const candidatos = [
  {
    id: 1,
    nombre: "Carlos Maurera",
    titulo: "Ingeniero de Sistemas",
    iniciales: "CM",
    bgColor: "bg-blue-100",
    skills: ["Python", "NLP", "FastAPI"],
    score: 92,
    scoreColor: "green",
    ofertaId: 1,
  },
  {
    id: 2,
    nombre: "Alexander Oliveros",
    titulo: "Desarrollador Jr",
    iniciales: "AO",
    bgColor: "bg-orange-100",
    skills: ["Python", "Django"],
    score: 68,
    scoreColor: "yellow",
    ofertaId: 1,
  },
  {
    id: 3,
    nombre: "Maria Gonzalez",
    titulo: "Frontend Developer",
    iniciales: "MG",
    bgColor: "bg-purple-100",
    skills: ["React", "Tailwind", "TypeScript"],
    score: 85,
    scoreColor: "green",
    ofertaId: 2,
  },
  {
    id: 4,
    nombre: "Luis Rodriguez",
    titulo: "Full Stack Developer",
    iniciales: "LR",
    bgColor: "bg-teal-100",
    skills: ["React", "Node.js", "PostgreSQL"],
    score: 74,
    scoreColor: "yellow",
    ofertaId: 2,
  },
];

export const respuestasCandidatos = [
  {
    candidatoId: 1,
    ofertaId: 1,
    respuestas: [
      { preguntaId: "p1", pregunta: "¿Tienes experiencia trabajando en equipo?", tipo: "si-no", respuesta: "Sí" },
      { preguntaId: "p2", pregunta: "¿Cuál es tu expectativa salarial?", tipo: "texto", respuesta: "$2500 - $3000 mensuales" },
      { preguntaId: "p3", pregunta: "¿Cuándo podrías incorporarte?", tipo: "texto", respuesta: "Inmediatamente" },
      { preguntaId: "p4", pregunta: "¿Has liderado proyectos anteriormente?", tipo: "si-no", respuesta: "Sí" },
    ],
  },
  {
    candidatoId: 2,
    ofertaId: 1,
    respuestas: [
      { preguntaId: "p1", pregunta: "¿Tienes experiencia trabajando en equipo?", tipo: "si-no", respuesta: "Sí" },
      { preguntaId: "p2", pregunta: "¿Cuál es tu expectativa salarial?", tipo: "texto", respuesta: "$1800 - $2200 mensuales" },
      { preguntaId: "p3", pregunta: "¿Cuándo podrías incorporarte?", tipo: "texto", respuesta: "En 2 semanas" },
      { preguntaId: "p4", pregunta: "¿Has liderado proyectos anteriormente?", tipo: "si-no", respuesta: "No" },
    ],
  },
  {
    candidatoId: 3,
    ofertaId: 2,
    respuestas: [
      { preguntaId: "p1", pregunta: "¿Tienes experiencia trabajando en equipo?", tipo: "si-no", respuesta: "Sí" },
      { preguntaId: "p2", pregunta: "¿Cuál es tu nivel de inglés?", tipo: "multiple", respuesta: "Intermedio (B2)" },
      { preguntaId: "p3", pregunta: "¿Disponibilidad para viajar?", tipo: "si-no", respuesta: "Sí" },
    ],
  },
  {
    candidatoId: 4,
    ofertaId: 2,
    respuestas: [
      { preguntaId: "p1", pregunta: "¿Tienes experiencia trabajando en equipo?", tipo: "si-no", respuesta: "Sí" },
      { preguntaId: "p2", pregunta: "¿Cuál es tu nivel de inglés?", tipo: "multiple", respuesta: "Avanzado (C1)" },
      { preguntaId: "p3", pregunta: "¿Disponibilidad para viajar?", tipo: "si-no", respuesta: "No" },
    ],
  },
];

export const perfilCandidato = {
  nombre: "Carlos Maurera",
  email: "carlos.m@email.com",
  educacion: "Ingeniería de Sistemas e Informática",
  universidad: "Universidad Gran Mariscal de Ayacucho",
  periodo: "2018 - 2025",
};
