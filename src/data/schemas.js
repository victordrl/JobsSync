export const ROLES = {
  CANDIDATO: "candidato",
  RECLUTADOR: "reclutador",
};

export const MODALIDADES = {
  REMOTO: "Remoto",
  HIBRIDO: "Híbrido",
  PRESENCIAL: "Presencial",
};

export const TIPOS_PREGUNTA = {
  TEXTO: "texto",
  SI_NO: "si-no",
  MULTIPLE: "multiple",
};

export const NIVEL_SKILL = {
  BASICO: "básico",
  INTERMEDIO: "intermedio",
  AVANZADO: "avanzado",
  EXPERTO: "experto",
};

export function createUser(data = {}) {
  return {
    id: data.id ?? crypto.randomUUID(),
    email: data.email ?? "",
    password: data.password ?? "",
    rol: data.rol ?? ROLES.CANDIDATO,
    nombre: data.nombre ?? "",
    createdAt: data.createdAt ?? new Date().toISOString(),
  };
}

export function createCandidateProfile(data = {}) {
  return {
    id: data.id ?? crypto.randomUUID(),
    userId: data.userId ?? "",
    filename: data.filename ?? "",
    uploadedAt: data.uploadedAt ?? new Date().toISOString(),
    nombre: data.nombre ?? "",
    email: data.email ?? "",
    telefono: data.telefono ?? "",
    profesion: data.profesion ?? "",
    experiencia_anios: data.experiencia_anios ?? 0,
    hard_skills: data.hard_skills ?? [],
    soft_skills: data.soft_skills ?? [],
    rawText: data.rawText ?? "",
    processorVersion: data.processorVersion ?? "",
    processingTime: data.processingTime ?? 0,
  };
}

export function createSkillCatalogEntry(data = {}) {
  return {
    nombre: data.nombre ?? "",
    categoria: data.categoria ?? "general",
    veces_usada: data.veces_usada ?? 1,
    primera_aparicion: data.primera_aparicion ?? new Date().toISOString(),
    ultima_aparicion: data.ultima_aparicion ?? new Date().toISOString(),
  };
}

export function createOferta(data = {}) {
  return {
    id: data.id ?? crypto.randomUUID(),
    reclutadorId: data.reclutadorId ?? "",
    titulo: data.titulo ?? "",
    empresa: data.empresa ?? "",
    ubicacion: data.ubicacion ?? "",
    modalidad: data.modalidad ?? MODALIDADES.REMOTO,
    salario: data.salario ?? "",
    descripcion: data.descripcion ?? "",
    skills: data.skills ?? [],
    requisitos: data.requisitos ?? [],
    preguntas: data.preguntas ?? [],
    timeLimit: data.timeLimit ?? null,
    createdAt: data.createdAt ?? new Date().toISOString(),
    activa: data.activa ?? true,
  };
}

export function createPregunta(data = {}) {
  return {
    id: data.id ?? `p-${crypto.randomUUID()}`,
    texto: data.texto ?? "",
    tipo: data.tipo ?? TIPOS_PREGUNTA.TEXTO,
    opciones: data.opciones ?? [],
    timeLimit: data.timeLimit ?? null,
  };
}

export function createAplicacion(data = {}) {
  return {
    id: data.id ?? crypto.randomUUID(),
    candidatoId: data.candidatoId ?? "",
    ofertaId: data.ofertaId ?? "",
    respuestas: data.respuestas ?? [],
    score: data.score ?? 0,
    scoreDetalle: data.scoreDetalle ?? { skills: 0, experiencia: 0, softSkills: 0 },
    tiempoRespuesta: data.tiempoRespuesta ?? 0,
    completada: data.completada ?? true,
    createdAt: data.createdAt ?? new Date().toISOString(),
  };
}

export function createRespuesta(data = {}) {
  return {
    preguntaId: data.preguntaId ?? "",
    pregunta: data.pregunta ?? "",
    tipo: data.tipo ?? TIPOS_PREGUNTA.TEXTO,
    respuesta: data.respuesta ?? "",
  };
}

export function fromGeminiProfile(geminiData, userId) {
  return {
    id: crypto.randomUUID(),
    userId,
    filename: "",
    uploadedAt: new Date().toISOString(),
    nombre: geminiData.datos_personales.nombre_completo,
    email: "",
    telefono: "",
    profesion: geminiData.datos_personales.profesion_oficio_principal,
    experiencia_anios: geminiData.resumen_trayectoria.anos_experiencia_total,
    hard_skills: geminiData.habilidades.hard_skills.map((s) => ({
      nombre: s,
      categoria: "general",
      nivel: "intermedio",
    })),
    soft_skills: (geminiData.habilidades.soft_skills || []).map((s) => ({
      nombre: s,
      nivel: "alto",
    })),
    rawText: "",
    processorVersion: "gemini-2.5-flash",
    processingTime: 0,
  };
}
