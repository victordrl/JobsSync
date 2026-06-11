"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Briefcase } from "@phosphor-icons/react";
import { SidebarReclutador } from "@/components/layout/SidebarReclutador";
import { CandidateTable } from "@/components/recruiter/CandidateTable";
import { AnswersModal } from "@/components/recruiter/AnswersModal";
import { GlassCard } from "@/components/ui/GlassCard";
import { useDataService } from "@/hooks/useDataService";

export default function ReclutadorDashboard() {
  const router = useRouter();
  const { db } = useDataService();
  const [activeTab, setActiveTab] = useState("ranking");
  const [selectedOfertaId, setSelectedOfertaId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCandidato, setSelectedCandidato] = useState(null);
  const [ofertasCreadas, setOfertas] = useState([]);
  const [allProfiles, setAllProfiles] = useState([]);
  const [aplicaciones, setAplicaciones] = useState([]);

  useEffect(() => {
    const user = db.getCurrentUser();
    if (!user) {
      router.replace("/login");
      return;
    }
    setOfertas(db.getOfertas());
    setAllProfiles(db.getAllProfiles());
    setAplicaciones(db.getAplicaciones());
  }, [db, router]);

  const ofertasMap = {};
  ofertasCreadas.forEach((o) => {
    ofertasMap[o.id] = o.titulo;
  });

  function profileToCandidate(p, score, scoreColor, ofertaId) {
    const name = p.nombre || "";
    return {
      id: p.id,
      nombre: name,
      titulo: p.profesion || "",
      iniciales: name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      bgColor: scoreColor === "green" ? "bg-emerald-100" : "bg-amber-100",
      skills: (p.hard_skills || []).map((s) => s.nombre),
      score: score || 0,
      scoreColor: scoreColor || "yellow",
      ofertaId: ofertaId || null,
    };
  }

  const filteredCandidatos = selectedOfertaId
    ? allProfiles.filter((p) =>
        aplicaciones.some((a) => a.candidatoId === p.id && a.ofertaId === selectedOfertaId)
      ).map((p) => {
        const apl = aplicaciones.find((a) => a.candidatoId === p.id && a.ofertaId === selectedOfertaId);
        return profileToCandidate(p, apl?.score, (apl?.score || 0) >= 80 ? "green" : "yellow", selectedOfertaId);
      })
    : allProfiles.map((p) => {
        const mejorApl = aplicaciones
          .filter((a) => a.candidatoId === p.id)
          .sort((a, b) => b.score - a.score)[0];
        return profileToCandidate(p, mejorApl?.score, (mejorApl?.score || 0) >= 80 ? "green" : "yellow", mejorApl?.ofertaId);
      });

  const handleViewAnswers = (candidato) => {
    setSelectedCandidato(candidato);
    setModalOpen(true);
  };

  const getRespuestas = (candidato) => {
    const apl = aplicaciones.find(
      (a) =>
        a.candidatoId === candidato.id &&
        (a.ofertaId === selectedOfertaId || a.ofertaId === candidato.ofertaId)
    );
    if (!apl) return null;
    return {
      respuestas: apl.respuestas.map((r) => ({
        preguntaId: r.preguntaId,
        pregunta: r.pregunta,
        tipo: r.tipo,
        respuesta: r.respuesta,
      })),
    };
  };

  const getCandidatosCount = (ofertaId) => {
    return aplicaciones.filter((a) => a.ofertaId === ofertaId).length;
  };

  const ofertaTitulo = selectedOfertaId
    ? ofertasMap[selectedOfertaId]
    : selectedCandidato?.ofertaId
      ? ofertasMap[selectedCandidato.ofertaId] || ""
      : "";

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <SidebarReclutador />

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white sticky top-0 z-10 border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {activeTab === "ranking"
                ? "Ranking de Candidatos"
                : selectedOfertaId
                  ? `Candidatos — ${ofertasMap[selectedOfertaId]}`
                  : "Mis Ofertas Publicadas"}
            </h2>
            <p className="text-sm text-slate-500">
              {activeTab === "ranking"
                ? `${filteredCandidatos.length} candidato(s) en total`
                : selectedOfertaId
                  ? `${getCandidatosCount(selectedOfertaId)} candidato(s) aplicaron`
                  : `${ofertasCreadas.length} oferta(s) publicada(s)`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => { setActiveTab("ranking"); setSelectedOfertaId(null); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === "ranking"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Ranking Candidatos
              </button>
              <button
                onClick={() => { setActiveTab("ofertas"); setSelectedOfertaId(null); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === "ofertas"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Mis Ofertas
              </button>
            </div>
            {selectedOfertaId && (
              <button
                onClick={() => setSelectedOfertaId(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition"
              >
                ← Volver a ofertas
              </button>
            )}
          </div>
        </header>

        {activeTab === "ranking" && !selectedOfertaId && (
          <CandidateTable
            candidatos={filteredCandidatos}
            ofertasMap={ofertasMap}
            onViewAnswers={handleViewAnswers}
          />
        )}

        {activeTab === "ofertas" && !selectedOfertaId && (
          <div className="p-8">
            {ofertasCreadas.length === 0 ? (
              <GlassCard className="p-12 text-center">
                <Briefcase size={48} className="mx-auto text-slate-300 mb-4" weight="light" />
                <h3 className="text-lg font-bold text-slate-700 mb-2">No hay ofertas publicadas</h3>
                <p className="text-slate-500 mb-6">Crea tu primera oferta para comenzar a recibir candidatos</p>
                <a
                  href="/dashboard/reclutador/ofertas/nueva"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-sm"
                >
                  Publicar Oferta
                </a>
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ofertasCreadas.map((oferta) => {
                  const count = getCandidatosCount(oferta.id);
                  return (
                    <GlassCard
                      key={oferta.id}
                      className="p-6 space-y-4 cursor-pointer"
                      hover
                    >
                      <div onClick={() => { setSelectedOfertaId(oferta.id); setActiveTab("ranking"); }}>
                        <h3 className="text-lg font-bold text-slate-800">{oferta.titulo}</h3>
                        <p className="text-sm text-indigo-600 font-semibold">{oferta.empresa}</p>
                      </div>

                      <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Ubicación</span>
                          <span className="font-medium">{oferta.ubicacion}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Modalidad</span>
                          <span className="font-medium">{oferta.modalidad}</span>
                        </div>
                        {oferta.salario && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Salario</span>
                            <span className="font-medium text-emerald-600">{oferta.salario}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-2">Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {(oferta.skills || []).slice(0, 4).map((skill) => (
                            <span key={skill} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-xs font-medium">
                              {skill}
                            </span>
                          ))}
                          {(oferta.skills || []).length > 4 && (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs font-medium">
                              +{(oferta.skills || []).length - 4}
                            </span>
                          )}
                        </div>
                      </div>

                      {oferta.preguntas && oferta.preguntas.length > 0 && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-violet-50 rounded-lg">
                          <span className="text-xs font-semibold text-violet-600">{oferta.preguntas.length} pregunta(s) de screening</span>
                        </div>
                      )}

                      <div
                        onClick={() => { setSelectedOfertaId(oferta.id); setActiveTab("ranking"); }}
                        className="flex items-center justify-between px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition"
                      >
                        <span className="text-sm font-semibold text-slate-700">{count} candidato(s)</span>
                        <span className="text-xs text-indigo-600 font-medium">Ver ranking →</span>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2">{oferta.descripcion}</p>
                    </GlassCard>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "ranking" && selectedOfertaId && (
          <CandidateTable
            candidatos={filteredCandidatos}
            ofertasMap={ofertasMap}
            onViewAnswers={handleViewAnswers}
          />
        )}
      </main>

      <AnswersModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedCandidato(null); }}
        candidato={selectedCandidato}
        ofertaTitulo={ofertaTitulo}
        respuestas={selectedCandidato ? getRespuestas(selectedCandidato) : undefined}
      />
    </div>
  );
}
