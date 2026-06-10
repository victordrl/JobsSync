"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle,
  Code,
  Briefcase,
  Buildings,
  ThumbsUp,
  WarningCircle,
} from "@phosphor-icons/react";
import { SidebarCandidato } from "@/components/layout/SidebarCandidato";
import { StatCard } from "@/components/ui/StatCard";
import { OfferCard } from "@/components/candidate/OfferCard";
import { SkillRadar } from "@/components/candidate/SkillRadar";
import { ProfileInfo } from "@/components/candidate/ProfileInfo";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { ofertas } from "@/data/ofertas";

export default function CandidatoDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [modalOferta, setModalOferta] = useState(null);
  const [modalMode, setModalMode] = useState("detail");
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [ofertasOrdenadas, setOfertasOrdenadas] = useState([]);
  const [stats, setStats] = useState({ topScore: 0, topEmpresa: "", totalSkills: 0, totalOfertas: 0 });

  useEffect(() => {
    const ordenadas = [...ofertas].sort((a, b) => b.score - a.score);
    setOfertasOrdenadas(ordenadas);

    const top = ordenadas[0];
    const allSkills = new Set(ofertas.flatMap((o) => o.skills));
    const compatibles = ofertas.filter((o) => o.score >= 70).length;

    setStats({
      topScore: top?.score || 0,
      topEmpresa: top?.empresa || "",
      totalSkills: allSkills.size,
      totalOfertas: compatibles,
    });
  }, []);

  const handleOpenOffer = (oferta) => {
    setModalOferta(oferta);
    setModalMode("detail");
    setRespuestas({});
  };

  const handleApply = () => {
    const raw = localStorage.getItem("ofertas_creadas");
    if (!raw || !modalOferta) return;

    const creadas = JSON.parse(raw);
    const creada = creadas.find((c) => c.id === modalOferta.ofertaCreadaId);
    setPreguntas(creada?.preguntas || []);
    setModalMode("apply");
  };

  const handleSetRespuesta = (preguntaId, valor) => {
    setRespuestas({ ...respuestas, [preguntaId]: valor });
  };

  const handleSubmit = () => {
    const existing = JSON.parse(localStorage.getItem("respuestas_candidato") || "[]");
    const nueva = {
      ofertaId: modalOferta?.ofertaCreadaId,
      ofertaTitulo: modalOferta?.titulo,
      respuestas: preguntas.map((p) => ({
        preguntaId: p.id,
        pregunta: p.texto,
        tipo: p.tipo,
        respuesta: respuestas[p.id] || "",
      })),
      fecha: new Date().toISOString(),
    };
    existing.push(nueva);
    localStorage.setItem("respuestas_candidato", JSON.stringify(existing));
    setModalMode("success");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <SidebarCandidato activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 px-8 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">
            {activeTab === "dashboard" ? "Panel de Control" : "Mi Perfil"}
          </h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-blue-600 transition relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {activeTab === "dashboard" && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                  icon={<CheckCircle size={24} weight="fill" />}
                  label={`Mayor Match — ${stats.topEmpresa}`}
                  value={`${stats.topScore}%`}
                  color="green"
                />
                <StatCard
                  icon={<Code size={24} weight="fill" />}
                  label="Skills Detectadas"
                  value={stats.totalSkills}
                  color="blue"
                />
                <StatCard
                  icon={<Briefcase size={24} weight="fill" />}
                  label="Ofertas Compatibles"
                  value={stats.totalOfertas}
                  color="purple"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-xl font-bold text-slate-900">
                    Recomendaciones de IA
                  </h3>

                  {ofertasOrdenadas.map((o) => (
                    <OfferCard
                      key={o.id}
                      oferta={o}
                      onClick={() => handleOpenOffer(o)}
                    />
                  ))}
                </div>

                <SkillRadar />
              </div>
            </div>
          )}

          {activeTab === "perfil" && (
            <div className="animate-fade-in">
              <ProfileInfo />
            </div>
          )}
        </div>
      </main>

      <Modal
        isOpen={!!modalOferta}
        onClose={() => { setModalOferta(null); setModalMode("detail"); }}
        title={modalOferta?.titulo ?? ""}
        subtitle={
          modalMode === "detail"
            ? "Análisis de Compatibilidad Detallado"
            : modalMode === "apply"
              ? "Responde las preguntas para aplicar"
              : "Postulación completada"
        }
        icon={<Buildings size={32} weight="bold" className="text-white" />}
        gradientFrom={modalMode === "success" ? "from-emerald-600" : "from-blue-600"}
        gradientTo={modalMode === "success" ? "to-green-600" : "to-indigo-600"}
      >
        {modalOferta && modalMode === "detail" && (
          <>
            <div className="flex items-center justify-center mb-8">
              <div className="text-center">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke={modalOferta.color === "green" ? "#dcfce7" : "#fef9c3"}
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke={modalOferta.color === "green" ? "#22c55e" : "#eab308"}
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={352}
                      strokeDashoffset={352 - (modalOferta.score / 100) * 352}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-slate-800">
                    {modalOferta.score}%
                  </span>
                </div>
                <p className="mt-2 font-bold text-slate-500 uppercase tracking-widest text-xs">
                  Match Score
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <h5 className="text-sm font-bold text-green-600 uppercase mb-4 flex items-center gap-2">
                  <ThumbsUp size={16} weight="fill" /> Fortalezas
                </h5>
                <div className="flex flex-wrap gap-2">
                  {modalOferta.fortalezas.map((f) => (
                    <Badge key={f} text={f} color="green" />
                  ))}
                </div>
              </div>
              <div>
                <h5 className="text-sm font-bold text-orange-500 uppercase mb-4 flex items-center gap-2">
                  <WarningCircle size={16} weight="fill" /> Gaps (Faltantes)
                </h5>
                <div className="flex flex-wrap gap-2">
                  {modalOferta.gaps.map((g) => (
                    <Badge key={g} text={g} color="red" />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => { setModalOferta(null); setModalMode("detail"); }}
                className="px-5 py-2 text-slate-500 hover:bg-slate-50 rounded-lg font-medium transition"
              >
                Cerrar
              </button>
              <button
                onClick={handleApply}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30 transition"
              >
                Aplicar Ahora
              </button>
            </div>
          </>
        )}

        {modalOferta && modalMode === "apply" && (
          <div className="space-y-4">
            {preguntas.length === 0 ? (
              <p className="text-center text-slate-500 py-8">Esta oferta no tiene preguntas de screening.</p>
            ) : (
              preguntas.map((p, index) => (
                <div key={p.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-sm font-semibold text-slate-700 mb-3">
                    <span className="inline-flex w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full items-center justify-center text-xs font-bold mr-2">
                      {index + 1}
                    </span>
                    {p.texto}
                  </p>

                  {p.tipo === "texto" && (
                    <input
                      type="text"
                      value={respuestas[p.id] || ""}
                      onChange={(e) => handleSetRespuesta(p.id, e.target.value)}
                      placeholder="Tu respuesta..."
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                  )}

                  {p.tipo === "si-no" && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleSetRespuesta(p.id, "Sí")}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition ${
                          respuestas[p.id] === "Sí"
                            ? "bg-emerald-100 border-emerald-300 text-emerald-700"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        Sí
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetRespuesta(p.id, "No")}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition ${
                          respuestas[p.id] === "No"
                            ? "bg-red-100 border-red-300 text-red-700"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        No
                      </button>
                    </div>
                  )}

                  {p.tipo === "multiple" && p.opciones && (
                    <select
                      value={respuestas[p.id] || ""}
                      onChange={(e) => handleSetRespuesta(p.id, e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    >
                      <option value="">Selecciona una opción</option>
                      {p.opciones.map((op) => (
                        <option key={op} value={op}>{op}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setModalMode("detail")}
                className="px-5 py-2 text-slate-500 hover:bg-slate-50 rounded-lg font-medium transition"
              >
                Volver
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30 transition"
              >
                Enviar Respuestas
              </button>
            </div>
          </div>
        )}

        {modalMode === "success" && (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle size={40} className="text-green-600" weight="fill" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">¡Postulación enviada!</h3>
            <p className="text-slate-500 text-center">
              Tus respuestas han sido enviadas exitosamente. El reclutador las revisará pronto.
            </p>
            <button
              onClick={() => { setModalOferta(null); setModalMode("detail"); }}
              className="mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-lg transition"
            >
              Cerrar
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
