import { GoogleGenAI, createPartFromUri } from "@google/genai";

const apiKey =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_GEMINI_API_KEY
    ? process.env.NEXT_PUBLIC_GEMINI_API_KEY
    : "";

const ai = new GoogleGenAI({ apiKey });

const CV_SCHEMA = {
  type: "object",
  properties: {
    candidato_id: { type: "string" },
    datos_personales: {
      type: "object",
      properties: {
        nombre_completo: { type: "string" },
        profesion_oficio_principal: { type: "string" },
      },
      required: ["nombre_completo", "profesion_oficio_principal"],
    },
    resumen_trayectoria: {
      type: "object",
      properties: {
        anos_experiencia_total: { type: "integer" },
        ultimo_cargo: { type: "string" },
      },
      required: ["anos_experiencia_total"],
    },
    habilidades: {
      type: "object",
      properties: {
        hard_skills: { type: "array", items: { type: "string" } },
        soft_skills: { type: "array", items: { type: "string" } },
      },
      required: ["hard_skills"],
    },
  },
  required: [
    "candidato_id",
    "datos_personales",
    "resumen_trayectoria",
    "habilidades",
  ],
};

const CV_PROMPT = `Eres un sistema experto en reclutamiento y análisis de talento (ATS). Tu tarea es escanear la imagen del currículum o documento adjunto, extraer la información relevante y normalizarla.

Sigue estrictamente estas reglas de procesamiento:

1. NORMALIZACIÓN DE HABILIDADES (Skills):
- Debes abstraer y estandarizar las habilidades. No copies textualmente descripciones informales o redundantes.
- Traduce descripciones de tareas a la habilidad/rol técnico correspondiente.
- Clasifica las habilidades en 'hard_skills' (técnicas/oficios) y 'soft_skills' (blandas/sociales).

2. EXTRACCIÓN DE INFORMACIÓN RELEVANTE:
- Extrae el nombre, datos de contacto básicos, profesión u oficio principal resumido, y los años de experiencia estimados en total.

3. IDIOMA:
- Toda la salida debe ser procesada en Español.

4. FORMATO DE SALIDA:
- Devuelve única y exclusivamente un objeto JSON que cumpla estrictamente con la estructura definida, sin texto introductorio ni bloques de código markdown.`;

export async function parseCV(fileBlob, onProgress) {
  onProgress?.("Subiendo PDF a Gemini API...");

  const uploadedFile = await ai.files.upload({
    file: fileBlob,
    config: { mimeType: fileBlob.type || "application/pdf" },
  });

  onProgress?.("Esperando procesamiento del documento...");

  let file = await ai.files.get({ name: uploadedFile.name });
  while (file.state === "PROCESSING") {
    await new Promise((r) => setTimeout(r, 2000));
    file = await ai.files.get({ name: uploadedFile.name });
  }

  if (file.state === "FAILED") {
    throw new Error("El procesamiento del PDF falló en Gemini.");
  }

  onProgress?.("Extrayendo y normalizando habilidades...");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      CV_PROMPT,
      createPartFromUri(file.uri, file.mimeType),
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: CV_SCHEMA,
    },
  });

  onProgress?.("Perfil normalizado correctamente.");
  return JSON.parse(response.text);
}

const MATCH_SCHEMA = {
  type: "array",
  items: {
    type: "object",
    properties: {
      candidato_id: { type: "string" },
      oferta_id: { type: "string" },
      "%_compatibilidad": { type: "integer", minimum: 0, maximum: 100 },
    },
    required: ["candidato_id", "oferta_id", "%_compatibilidad"],
  },
};

export async function getMatches(profileData, ofertas) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        text: `Eres un algoritmo de coincidencia (Matching Engine) imparcial y automatizado para plataformas de empleo. Tu única tarea es calcular el porcentaje de compatibilidad (Match) entre un listado de Candidatos (con perfiles extraídos) y un listado de Ofertas de Trabajo.

REGLAS DE NORMALIZACIÓN SEMÁNTICA:
- Aplica una equivalencia conceptual estricta. Si las habilidades o la experiencia están redactadas de manera diferente pero significan lo mismo, debes considerarlas como una coincidencia perfecta.

CRITERIOS DE EVALUACIÓN (0 a 100%):
- SKILLS REQUERIDOS (50% del peso): Evalúa qué porcentaje de las habilidades técnicas (Hard) y blandas (Soft) requeridas en la oferta posee el candidato tras la normalización.
- REQUISITOS Y EXPERIENCIA (30% del peso): Compara los años de experiencia totales del candidato con lo solicitado, además del nivel del cargo.
- UBICACIÓN Y MODALIDAD (20% del peso): Evalúa si el candidato es compatible con la modalidad (Remoto, Presencial, Híbrido). Si la oferta es remota, la ubicación no resta puntos.

REGLAS DE FORMATO DE SALIDA:
- Devuelve única y exclusivamente un objeto JSON.
- No incluyas texto introductorio, ni explicaciones, ni bloques de código Markdown. Solo el JSON limpio.
- La estructura del JSON debe ser un arreglo de objetos que empareje el 'candidato_id' con la 'oferta_id' y su respectivo '%_compatibilidad' (número entero entre 0 y 100).

DATOS DE ENTRADA PARA PROCESAR:

--- LISTADO DE CANDIDATOS ---
${JSON.stringify([profileData])}

--- LISTADO DE OFERTAS DE TRABAJO ---
${JSON.stringify(ofertas)}`,
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: MATCH_SCHEMA,
    },
  });

  return JSON.parse(response.text);
}
