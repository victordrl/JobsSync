"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Brain, CheckCircle, XCircle } from "@phosphor-icons/react";
import { getDataService } from "@/lib/dataService";
import { fromGeminiProfile } from "@/data/schemas";
import { parseCV } from "@/lib/geminiService";

export default function LoadingPage() {
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [estado, setEstado] = useState("procesando");
  const iniciado = useRef(false);

  useEffect(() => {
    const user = getDataService().getCurrentUser();
    if (!user) {
      router.replace("/login");
      return;
    }

    if (iniciado.current) return;
    iniciado.current = true;

    const addLog = (text) => {
      setLogs((prev) => [...prev, { text, time: new Date().toLocaleTimeString() }]);
    };

    const procesar = async () => {
      try {
        const raw = sessionStorage.getItem("pending_cv_data");
        if (!raw) {
          addLog("No hay CV pendiente. Redirigiendo...");
          setTimeout(() => router.push("/upload"), 1500);
          return;
        }

        const meta = JSON.parse(sessionStorage.getItem("pending_cv") || "{}");
        addLog(`Archivo: ${meta.name || "CV"}`);

        const byteStr = atob(raw.split(",")[1]);
        const ab = new ArrayBuffer(byteStr.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteStr.length; i++) ia[i] = byteStr.charCodeAt(i);
        const blob = new Blob([ab], {
          type: raw.split(";")[0].split(":")[1] || "application/pdf",
        });

        const geminiData = await parseCV(blob, addLog);

        addLog(
          `Candidato: ${geminiData.datos_personales.nombre_completo}`
        );
        addLog(
          `Profesión: ${geminiData.datos_personales.profesion_oficio_principal}`
        );
        addLog(
          `Experiencia: ${geminiData.resumen_trayectoria.anos_experiencia_total} años`
        );
        addLog(
          `Hard skills: ${(geminiData.habilidades.hard_skills || []).join(", ")}`
        );
        addLog(
          `Soft skills: ${(geminiData.habilidades.soft_skills || []).join(", ")}`
        );

        const db = getDataService();
        const profile = fromGeminiProfile(geminiData, user.id);
        db.saveProfile(profile);
        db.clearResultadosMatching(user.id);

        (geminiData.habilidades.hard_skills || []).forEach((s) =>
          db.addSkillToCatalog(s, "general")
        );

        sessionStorage.removeItem("pending_cv_data");
        sessionStorage.removeItem("pending_cv");

        addLog("Perfil guardado correctamente.");
        setEstado("completado");
        setTimeout(() => router.push("/dashboard/candidato"), 1500);
      } catch (err) {
        addLog(`Error: ${err.message}`);
        setEstado("error");
      }
    };

    procesar();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(#4f46e5 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      ></div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div
              className={`w-24 h-24 border-4 rounded-full ${
                estado === "error"
                  ? "border-red-500/30 border-t-red-500"
                  : estado === "completado"
                    ? "border-green-500/30 border-t-green-500"
                    : "border-blue-500/30 border-t-blue-500 animate-spin"
              }`}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              {estado === "error" ? (
                <XCircle size={32} className="text-red-400" weight="fill" />
              ) : estado === "completado" ? (
                <CheckCircle size={32} className="text-green-400" weight="fill" />
              ) : (
                <Brain size={32} weight="fill" className="text-white animate-pulse" />
              )}
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-6">
          {estado === "error"
            ? "Error al procesar"
            : estado === "completado"
              ? "¡CV procesado correctamente!"
              : "Procesando con Gemini IA"}
        </h2>

        <div className="bg-slate-800 rounded-xl p-4 font-mono text-sm space-y-1 max-h-64 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-slate-500 shrink-0">[{log.time}]</span>
              <span className="text-green-400">{log.text}</span>
            </div>
          ))}
          {estado === "procesando" && (
            <span className="text-slate-500 animate-pulse">_</span>
          )}
        </div>
      </div>
    </div>
  );
}
