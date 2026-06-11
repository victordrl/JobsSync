"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCircle,
  Code,
  Briefcase,
  Buildings,
  ThumbsUp,
  WarningCircle,
  ArrowsClockwise,
  Clock,
  X,
} from "@phosphor-icons/react";
import { SidebarCandidato } from "@/components/layout/SidebarCandidato";
import { StatCard } from "@/components/ui/StatCard";
import { OfferCard } from "@/components/candidate/OfferCard";
import { SkillRadar } from "@/components/candidate/SkillRadar";
import { ProfileInfo } from "@/components/candidate/ProfileInfo";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { useDataService } from "@/hooks/useDataService";
import { createAplicacion, createRespuesta } from "@/data/schemas";

export default function CandidatoDashboard() {
  const { db, refresh } = useDataService();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [modalOferta, setModalOferta] = useState(null);
  const [modalMode, setModalMode] = useState("detail");
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [ofertasConMatch, setOfertasConMatch] = useState([]);
  const [stats, setStats] = useState({ topScore: 0, topEmpresa: "", totalSkills: 0, totalOfertas: 0 });
  const [profile, setProfile] = useState(null);
  const [notificaciones, setNotificaciones] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [yaAplico, setYaAplico] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(null);
  const timerRef = useRef(null);
  const aplicarIniciadoRef = useRef(false);
  const respuestasRef = useRef(respuestas);
  const preguntasRef = useRef(preguntas);

  useEffect(() => { respuestasRef.current = respuestas; }, [respuestas]);
  useEffect(() => { preguntasRef.current = preguntas; }, [preguntas]);
  const [filtroFecha, setFiltroFecha] = useState("todos");
  const [ordenScore, setOrdenScore] = useState("desc");

  const loadData = useCallback(() => {
    const user = db.getCurrentUser();
    if (!user) {
      router.replace("/login");
      return;
    }

    const p = db.getProfileByUserId(user.id);
    setProfile(p);
    if (!p) return;

    const ofertas = db.getOfertasConMatch(p.id);
    setOfertasConMatch(ofertas);

    const top = ofertas[0];
    const allSkills = new Set(ofertas.flatMap((o) => o.skills || []));
    const compatibles = ofertas.filter((o) => o.match?.score >= 70).length;

    setStats({
      topScore: top?.match?.score || 0,
      topEmpresa: top?.empresa || "",
      totalSkills: allSkills.size,
      totalOfertas: compatibles,
    });

    setNotificaciones(db.getNotificaciones(p.id));
  }, [db, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenOffer = (oferta) => {
    setModalOferta(oferta);
    setModalMode("detail");
    setRespuestas({});
    setYaAplico(false);

    if (profile) {
      const aplicaciones = db.getAplicacionesByCandidato(profile.id);
      const yaExiste = aplicaciones.some((a) => a.ofertaId === oferta.id);
      setYaAplico(yaExiste);
    }
  };

  const handleApply = () => {
    const oferta = db.getOfertaById(modalOferta.id);
    const preg = oferta?.preguntas || [];
    setPreguntas(preg);
    setModalMode("apply");

    const timeLimitMin = oferta?.timeLimit || modalOferta.timeLimit || null;

    if (timeLimitMin > 0) {
      aplicarIniciadoRef.current = false;
      setTiempoRestante(timeLimitMin * 60);
    } else {
      setTiempoRestante(null);
    }
  };

  useEffect(() => {
    if (modalMode !== "apply" || tiempoRestante === null) return;
    if (aplicarIniciadoRef.current) return;
    aplicarIniciadoRef.current = true;

    timerRef.current = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const animName = `timerShrink_${modalOferta?.id}`;
    if (!document.getElementById(animName) && totalTimeLimit > 0) {
      const style = document.createElement("style");
      style.id = animName;
      style.textContent = `@keyframes ${animName} { from { width: 100%; } to { width: 0%; } }`;
      document.head.appendChild(style);
    }

    return () => {
      clearInterval(timerRef.current);
    };
  }, [modalMode]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleSetRespuesta = (preguntaId, valor) => {
    setRespuestas({ ...respuestas, [preguntaId]: valor });
  };

  const handleSubmit = (autoEnvio = false) => {
    if (!profile || !modalOferta) return;

    clearInterval(timerRef.current);

    const pregActuales = preguntasRef.current;
    const respActuales = respuestasRef.current;

    const aplicacion = createAplicacion({
      candidatoId: profile.id,
      ofertaId: modalOferta.id,
      respuestas: pregActuales.map((p) =>
        createRespuesta({
          preguntaId: p.id,
          pregunta: p.texto,
          tipo: p.tipo,
          respuesta: respActuales[p.id] || "",
        })
      ),
      score: modalOferta.match?.score || 0,
      scoreDetalle: modalOferta.match
        ? {
            skills: modalOferta.match.skills,
            experiencia: modalOferta.match.experiencia,
            softSkills: modalOferta.match.softSkills,
          }
        : { skills: 0, experiencia: 0, softSkills: 0 },
      tiempoRespuesta: tiempoRestante !== null
        ? ((modalOferta.timeLimit || 0) * 60) - tiempoRestante
        : 0,
    });

    db.saveAplicacion(aplicacion);
    refresh();
    setModalMode("success");
  };

  const handleNotifClick = () => {
    setShowNotifDropdown(!showNotifDropdown);
  };

  const handleRefresh = () => {
    refresh();
    loadData();
  };

  const cerrarModal = () => {
    setModalOferta(null);
    setModalMode("detail");
    clearInterval(timerRef.current);
    setTiempoRestante(null);
  };

  const totalTimeLimit = modalOferta?.timeLimit || 0;
  const timeBarPercent = tiempoRestante !== null && totalTimeLimit > 0
    ? (tiempoRestante / (totalTimeLimit * 60)) * 100
    : null;

  const headerTitle =
    activeTab === "dashboard" ? "Panel de Control" :
    activeTab === "perfil" ? "Mi Perfil Parseado" :
    activeTab === "curriculum" ? "Curriculum" : "";

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <SidebarCandidato activeTab={activeTab} onTabChange={setActiveTab} profile={profile} />

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 px-8 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">{headerTitle}</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="p-2 text-slate-400 hover:text-blue-600 transition"
              title="Actualizar compatibilidad"
            >
              <ArrowsClockwise size={20} weight="bold" />
            </button>
            <div className="relative">
              <button
                onClick={handleNotifClick}
                className="p-2 text-slate-400 hover:text-blue-600 transition relative"
                title="Notificaciones"
              >
                <Bell size={20} />
                {notificaciones.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {notificaciones.length > 9 ? "9+" : notificaciones.length}
                  </span>
                )}
              </button>
              {showNotifDropdown && notificaciones.length > 0 && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                  <div className="p-3 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Nuevas ofertas compatibles
                    </p>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {notificaciones.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => {
                          setShowNotifDropdown(false);
                          handleOpenOffer(n);
                        }}
                        className="w-full text-left p-3 hover:bg-slate-50 transition border-b border-slate-50 last:border-0"
                      >
                        <p className="text-sm font-semibold text-slate-800">{n.titulo}</p>
                        <p className="text-xs text-slate-500">{n.empresa}</p>
                        <span
                          className={`inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                            n.match?.score >= 80
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {n.match?.score}% match
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
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

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">
                  Fecha:
                </span>
                {["hoy", "semana", "mes", "todos"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFiltroFecha(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      filtroFecha === f
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {f === "hoy" ? "Hoy" : f === "semana" ? "Semana" : f === "mes" ? "Mes" : "Todos"}
                  </button>
                ))}
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-4 mr-1">
                  Score:
                </span>
                <select
                  value={ordenScore}
                  onChange={(e) => setOrdenScore(e.target.value)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="desc">Mayor → Menor</option>
                  <option value="asc">Menor → Mayor</option>
                </select>
              </div>

              {(() => {
                const ahora = new Date();
                const inicioHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
                const inicioSemana = new Date(inicioHoy);
                inicioSemana.setDate(inicioSemana.getDate() - 7);
                const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

                const filtradas = ofertasConMatch.filter((o) => {
                  if (filtroFecha === "todos") return true;
                  const created = new Date(o.createdAt || ahora);
                  if (filtroFecha === "hoy") return created >= inicioHoy;
                  if (filtroFecha === "semana") return created >= inicioSemana;
                  if (filtroFecha === "mes") return created >= inicioMes;
                  return true;
                });

                const ordenadas = [...filtradas].sort((a, b) => {
                  const sa = a.match?.score || 0;
                  const sb = b.match?.score || 0;
                  return ordenScore === "desc" ? sb - sa : sa - sb;
                });

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                      <h3 className="text-xl font-bold text-slate-900">
                        Recomendaciones de IA
                      </h3>

                      {ordenadas.map((o) => (
                    <OfferCard
                      key={o.id}
                      oferta={{
                        ...o,
                        color: o.match?.score >= 80 ? "green" : o.match?.score >= 60 ? "yellow" : "red",
                        score: o.match?.score || 0,
                      }}
                      onClick={() => handleOpenOffer(o)}
                    />
                  ))}
                    </div>

                    <SkillRadar profile={profile} />
                  </div>
                );
              })()}
            </div>
          )}

          {activeTab === "perfil" && (
            <div className="animate-fade-in">
              <ProfileInfo profile={profile} />
            </div>
          )}

          {activeTab === "curriculum" && (
            <div className="animate-fade-in">
              <div className="flex flex-col items-center justify-center py-16 gap-6">
                <p className="text-slate-500 text-lg">Sube o actualiza tu currículum para mantener tu perfil actualizado</p>
                <button
                  onClick={() => router.push("/upload?replace=true")}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg transition text-lg"
                >
                  Volver a cargar CV
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Modal
        isOpen={!!modalOferta}
        onClose={cerrarModal}
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
        {modalOferta && modalMode === "detail" && (() => {
          const score = modalOferta.match?.score || 0;
          const color = score >= 80 ? "green" : score >= 60 ? "yellow" : "red";
          const profileSkills = profile?.hard_skills?.map((s) => s.nombre.toLowerCase()) || [];
          const offerSkills = modalOferta.skills || [];
          const fortalezas = offerSkills.filter((s) => profileSkills.includes(s));
          const gaps = offerSkills.filter((s) => !profileSkills.includes(s));

          return (
          <>
            <div className="flex items-center justify-center mb-8">
              <div className="text-center">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke={color === "green" ? "#dcfce7" : "#fef9c3"}
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke={color === "green" ? "#22c55e" : "#eab308"}
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={352}
                      strokeDashoffset={352 - (score / 100) * 352}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-slate-800">
                    {score}%
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
                  {fortalezas.length > 0 ? fortalezas.map((f) => (
                    <Badge key={f} text={f} color="green" />
                  )) : <p className="text-sm text-slate-400">Ninguna</p>}
                </div>
              </div>
              <div>
                <h5 className="text-sm font-bold text-orange-500 uppercase mb-4 flex items-center gap-2">
                  <WarningCircle size={16} weight="fill" /> Gaps (Faltantes)
                </h5>
                <div className="flex flex-wrap gap-2">
                  {gaps.length > 0 ? gaps.map((g) => (
                    <Badge key={g} text={g} color="red" />
                  )) : <p className="text-sm text-slate-400">Ninguno</p>}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={cerrarModal}
                className="px-5 py-2 text-slate-500 hover:bg-slate-50 rounded-lg font-medium transition"
              >
                Cerrar
              </button>
              {yaAplico ? (
                <span className="inline-flex items-center gap-2 px-5 py-2 bg-green-100 text-green-700 rounded-lg font-bold text-sm">
                  <CheckCircle size={16} weight="fill" /> Ya aplicaste
                </span>
              ) : (
                <button
                  onClick={handleApply}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30 transition"
                >
                  Aplicar Ahora
                </button>
              )}
            </div>
          </>
          );
        })()}

        {modalOferta && modalMode === "apply" && (
          <div className="space-y-4">
            {tiempoRestante !== null && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock size={16} weight="bold" />
                    <span className="font-semibold">{formatTime(tiempoRestante)}</span>
                  </div>
                  <span className="text-xs text-slate-400">tiempo restante</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    key={modalOferta?.id || "timer"}
                    className={`h-full rounded-full ${
                      timeBarPercent > 50
                        ? "bg-green-500"
                        : timeBarPercent > 20
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{
                      animation:
                        totalTimeLimit > 0
                          ? `timerShrink_${modalOferta?.id} ${totalTimeLimit * 60}s linear forwards`
                          : undefined,
                    }}
                    onAnimationEnd={() => handleSubmit(true)}
                  />
                </div>
              </div>
            )}

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
                onClick={() => { setModalMode("detail"); clearInterval(timerRef.current); setTiempoRestante(null); }}
                className="px-5 py-2 text-slate-500 hover:bg-slate-50 rounded-lg font-medium transition"
              >
                Volver
              </button>
              <button
                onClick={() => handleSubmit()}
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
              onClick={cerrarModal}
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
