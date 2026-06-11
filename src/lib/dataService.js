import {
  getSeedUsers,
  getSeedProfiles,
  getSeedSkillsCatalog,
  getSeedOfertas,
  getSeedAplicaciones,
} from "@/data/seed-data";
import { getMatches } from "./geminiService";

const STORAGE_KEYS = {
  USERS: "app_users",
  CURRENT_USER: "app_current_user",
  PROFILES: "perfiles_candidato",
  SKILLS_CATALOG: "skills_catalog",
  OFERTAS: "ofertas_creadas",
  APLICACIONES: "aplicaciones",
  RESULTADOS_MATCHING: "resultados_matching",
};

function read(key) {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function write(key, data) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

function ensureSeed() {
  if (typeof window === "undefined") return;
  if (read(STORAGE_KEYS.USERS)) return;

  write(STORAGE_KEYS.USERS, getSeedUsers());
  write(STORAGE_KEYS.PROFILES, getSeedProfiles());
  write(STORAGE_KEYS.SKILLS_CATALOG, getSeedSkillsCatalog());
  write(STORAGE_KEYS.OFERTAS, getSeedOfertas());
  write(STORAGE_KEYS.APLICACIONES, getSeedAplicaciones());
}

class DataService {
  constructor() {
    ensureSeed();
  }

  // ─── Auth ────────────────────────────────────────────────

  login(email, password) {
    const users = read(STORAGE_KEYS.USERS) || [];
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      write(STORAGE_KEYS.CURRENT_USER, user);
    }
    return user || null;
  }

  register(data) {
    const users = read(STORAGE_KEYS.USERS) || [];
    const exists = users.find((u) => u.email === data.email);
    if (exists) return null;
    users.push(data);
    write(STORAGE_KEYS.USERS, users);
    write(STORAGE_KEYS.CURRENT_USER, data);
    return data;
  }

  getCurrentUser() {
    return read(STORAGE_KEYS.CURRENT_USER);
  }

  logout() {
    write(STORAGE_KEYS.CURRENT_USER, null);
  }

  // ─── Perfiles candidato ──────────────────────────────────

  saveProfile(profile) {
    const profiles = read(STORAGE_KEYS.PROFILES) || [];
    const idx = profiles.findIndex((p) => p.id === profile.id);
    if (idx >= 0) {
      profiles[idx] = profile;
    } else {
      profiles.push(profile);
    }
    write(STORAGE_KEYS.PROFILES, profiles);
  }

  getProfile(profileId) {
    const profiles = read(STORAGE_KEYS.PROFILES) || [];
    return profiles.find((p) => p.id === profileId) || null;
  }

  getProfileByUserId(userId) {
    const profiles = read(STORAGE_KEYS.PROFILES) || [];
    return profiles.find((p) => p.userId === userId) || null;
  }

  getAllProfiles() {
    return read(STORAGE_KEYS.PROFILES) || [];
  }

  // ─── Catálogo de skills ──────────────────────────────────

  getSkills() {
    return read(STORAGE_KEYS.SKILLS_CATALOG) || [];
  }

  getSkillsSorted() {
    const skills = this.getSkills();
    return skills.sort((a, b) => b.veces_usada - a.veces_usada);
  }

  addSkillToCatalog(skillName, categoria = "general") {
    const catalog = this.getSkills();
    const existing = catalog.find((s) => s.nombre.toLowerCase() === skillName.toLowerCase());
    if (existing) {
      existing.veces_usada += 1;
      existing.ultima_aparicion = new Date().toISOString();
    } else {
      catalog.push({
        nombre: skillName,
        categoria,
        veces_usada: 1,
        primera_aparicion: new Date().toISOString(),
        ultima_aparicion: new Date().toISOString(),
      });
    }
    write(STORAGE_KEYS.SKILLS_CATALOG, catalog);
  }

  // ─── Ofertas ─────────────────────────────────────────────

  saveOferta(oferta) {
    const ofertas = read(STORAGE_KEYS.OFERTAS) || [];
    const idx = ofertas.findIndex((o) => o.id === oferta.id);
    if (idx >= 0) {
      ofertas[idx] = oferta;
    } else {
      ofertas.push(oferta);
    }
    write(STORAGE_KEYS.OFERTAS, ofertas);
  }

  getOfertas() {
    return read(STORAGE_KEYS.OFERTAS) || [];
  }

  getOfertaById(id) {
    const ofertas = this.getOfertas();
    return ofertas.find((o) => o.id === id) || null;
  }

  getOfertasByRecruiter(recrutadorId) {
    const ofertas = this.getOfertas();
    return ofertas.filter((o) => o.reclutadorId === recrutadorId);
  }

  // ─── Aplicaciones ────────────────────────────────────────

  saveAplicacion(aplicacion) {
    const aplicaciones = read(STORAGE_KEYS.APLICACIONES) || [];
    aplicaciones.push(aplicacion);
    write(STORAGE_KEYS.APLICACIONES, aplicaciones);
  }

  getAplicaciones() {
    return read(STORAGE_KEYS.APLICACIONES) || [];
  }

  getAplicacionesByOferta(ofertaId) {
    const aplicaciones = this.getAplicaciones();
    return aplicaciones.filter((a) => a.ofertaId === ofertaId);
  }

  getAplicacionesByCandidato(candidatoId) {
    const aplicaciones = this.getAplicaciones();
    return aplicaciones.filter((a) => a.candidatoId === candidatoId);
  }

  // ─── Matching ────────────────────────────────────────────

  calcularMatch(profile, oferta) {
    if (!profile || !oferta) return { score: 0, skills: 0, experiencia: 0, softSkills: 0 };

    const profileSkills = profile.hard_skills?.map((s) => s.nombre.toLowerCase()) || [];
    const offerSkills = oferta.skills?.map((s) => s.toLowerCase()) || [];

    if (offerSkills.length === 0) {
      return { score: 0, skills: 0, experiencia: 0, softSkills: 0 };
    }

    const matchedSkills = offerSkills.filter((s) => profileSkills.includes(s));
    const skillsScore = Math.round((matchedSkills.length / offerSkills.length) * 100);

    const expScore = Math.min(100, Math.round((profile.experiencia_anios / 5) * 100));

    const softWeight = profile.soft_skills?.length > 0 ? 100 : 0;

    const score = Math.round(skillsScore * 0.6 + expScore * 0.25 + softWeight * 0.15);

    return {
      score: Math.min(100, score),
      skills: skillsScore,
      experiencia: expScore,
      softSkills: softWeight,
    };
  }

  getOfertasConMatch(profileId) {
    const profile = this.getProfile(profileId);
    if (!profile) return [];

    const ofertas = this.getOfertas().filter((o) => o.activa);
    return ofertas
      .map((o) => ({
        ...o,
        match: this.calcularMatch(profile, o),
      }))
      .sort((a, b) => b.match.score - a.match.score);
  }

  async getMatchesConGemini(profileId) {
    const profile = this.getProfile(profileId);
    if (!profile) return [];

    const ofertas = this.getOfertas().filter((o) => o.activa);

    const profileData = {
      candidato_id: profileId,
      datos_personales: {
        nombre_completo: profile.nombre,
        profesion_oficio_principal: profile.profesion,
      },
      resumen_trayectoria: {
        anos_experiencia_total: profile.experiencia_anios,
        ultimo_cargo: profile.profesion,
      },
      habilidades: {
        hard_skills: profile.hard_skills.map((s) => s.nombre),
        soft_skills: profile.soft_skills.map((s) => s.nombre),
      },
    };

    const ofertasData = ofertas.map((o) => ({
      oferta_id: o.id,
      informacion_basica: {
        titulo_oferta: o.titulo,
        empresa: o.empresa,
        ubicacion: o.ubicacion,
        modalidad: o.modalidad,
        salario: o.salario || "",
      },
      descripcion: o.descripcion || "",
      skills_requeridos: o.skills || [],
      requisitos: (o.requisitos || []).join(". "),
    }));

    const matches = await getMatches(profileData, ofertasData);

    return ofertas
      .map((o) => {
        const m = matches.find((match) => match.oferta_id === o.id);
        return {
          ...o,
          match: {
            score: m?.["%_compatibilidad"] || 0,
            skills: 0,
            experiencia: 0,
            softSkills: 0,
          },
        };
      })
      .sort((a, b) => b.match.score - a.match.score);
  }

  // ─── Cache de resultados de matching ─────────────────────

  getResultadosMatching(candidatoId) {
    const results = read(STORAGE_KEYS.RESULTADOS_MATCHING) || [];
    const candidatoResults = results.find((r) => r.candidatoId === candidatoId);
    return candidatoResults || null;
  }

  saveResultadosMatching(candidatoId, resultados) {
    const results = read(STORAGE_KEYS.RESULTADOS_MATCHING) || [];
    const idx = results.findIndex((r) => r.candidatoId === candidatoId);
    const entry = {
      candidatoId,
      resultados,
      actualizadoAt: new Date().toISOString(),
    };
    if (idx >= 0) {
      results[idx] = entry;
    } else {
      results.push(entry);
    }
    write(STORAGE_KEYS.RESULTADOS_MATCHING, results);
  }

  clearResultadosMatching(candidatoId) {
    const results = read(STORAGE_KEYS.RESULTADOS_MATCHING) || [];
    const filtered = results.filter((r) => r.candidatoId !== candidatoId);
    write(STORAGE_KEYS.RESULTADOS_MATCHING, filtered);
  }

  // ─── Notificaciones ──────────────────────────────────────

  getNotificaciones(profileId) {
    const ofertasConMatch = this.getOfertasConMatch(profileId);
    const aplicaciones = this.getAplicacionesByCandidato(profileId);
    const ofertasAplicadas = new Set(aplicaciones.map((a) => a.ofertaId));

    const nuevas = ofertasConMatch.filter(
      (o) => o.match.score >= 70 && !ofertasAplicadas.has(o.id)
    );
    return nuevas;
  }
}

let instance = null;

export function getDataService() {
  if (typeof window !== "undefined") {
    if (!instance) {
      instance = new DataService();
    }
    return instance;
  }
  return new DataService();
}
