"use client";

import { useState, useCallback } from "react";
import { getDataService } from "@/lib/dataService";
import { createCandidateProfile } from "@/data/schemas";

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedProfile, setUploadedProfile] = useState(null);

  const iniciarAnalisis = useCallback((file) => {
    setIsUploading(true);

    const db = getDataService();
    const user = db.getCurrentUser();

    const profile = createCandidateProfile({
      userId: user?.id || "unknown",
      filename: file?.name || "CV_subido.pdf",
      nombre: user?.nombre || "Candidato",
      email: user?.email || "",
      profesion: "Profesional",
      experiencia_anios: 3,
      hard_skills: [
        { nombre: "Python", categoria: "backend", nivel: "intermedio" },
        { nombre: "JavaScript", categoria: "frontend", nivel: "intermedio" },
        { nombre: "React", categoria: "frontend", nivel: "básico" },
        { nombre: "SQL", categoria: "backend", nivel: "intermedio" },
      ],
      soft_skills: [
        { nombre: "Trabajo en equipo", nivel: "alto" },
        { nombre: "Comunicación efectiva", nivel: "alto" },
      ],
      rawText: "CV procesado simulado",
      processorVersion: "simulator-v1",
      processingTime: 2500,
    });

    profile.skills = profile.hard_skills.map((s) => s.nombre);
    profile.score = 78;
    profile.color = "yellow";

    profile.hard_skills.forEach((s) => db.addSkillToCatalog(s.nombre, s.categoria));

    const profiles = JSON.parse(localStorage.getItem("perfiles_candidato") || "[]");
    const existingIdx = profiles.findIndex((p) => p.userId === profile.userId);
    if (existingIdx >= 0) {
      profiles[existingIdx] = profile;
    } else {
      profiles.push(profile);
    }
    localStorage.setItem("perfiles_candidato", JSON.stringify(profiles));

    setUploadedProfile(profile);
    setIsUploading(false);
  }, []);

  return { isUploading, uploadedProfile, iniciarAnalisis };
}
