"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, ArrowLeft, Check, ListDashes, CaretDown } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";

const SKILLS_SUGERIDOS = [
  "JavaScript", "TypeScript", "Python", "React", "Next.js", "Node.js",
  "FastAPI", "Django", "PostgreSQL", "MongoDB", "Docker", "AWS",
  "Tailwind CSS", "GraphQL", "Git", "Agile", "Scrum"
];

const REQUISITOS_SUGERIDOS = [
  "Experiencia mínima 2 años", "Título universitario", "Inglés intermedio",
  "Disponibilidad inmediata", "Experiencia con APIs REST", "Conocimiento de Git",
  "Trabajo en equipo", "Resolución de problemas"
];

const PREGUNTAS_SUGERIDAS = [
  "¿Tienes experiencia trabajando en equipo?",
  "¿Disponibilidad para viajar?",
  "¿Cuál es tu expectativa salarial?",
  "¿Cuándo podrías incorporarte?",
  "¿Tienes experiencia con metodologías ágiles?",
  "¿Has liderado proyectos anteriormente?",
  "¿Cuál es tu nivel de inglés?"
];

export function OfferForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    titulo: "",
    empresa: "",
    ubicacion: "",
    modalidad: "Remoto",
    descripcion: "",
    salario: "",
  });
  const [skills, setSkills] = useState([]);
  const [requisitos, setRequisitos] = useState([]);
  const [preguntas, setPreguntas] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [requisitoInput, setRequisitoInput] = useState("");
  const [showSkillsSuggestions, setShowSkillsSuggestions] = useState(false);
  const [showRequisitosSuggestions, setShowRequisitosSuggestions] = useState(false);
  const [showPreguntasSuggestions, setShowPreguntasSuggestions] = useState(false);
  const [success, setSuccess] = useState(false);

  const [preguntaTexto, setPreguntaTexto] = useState("");
  const [preguntaTipo, setPreguntaTipo] = useState("texto");
  const [preguntaOpciones, setPreguntaOpciones] = useState([]);
  const [opcionInput, setOpcionInput] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput("");
    setShowSkillsSuggestions(false);
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const addRequisito = (requisito) => {
    const trimmed = requisito.trim();
    if (trimmed && !requisitos.includes(trimmed)) {
      setRequisitos([...requisitos, trimmed]);
    }
    setRequisitoInput("");
    setShowRequisitosSuggestions(false);
  };

  const removeRequisito = (requisito) => {
    setRequisitos(requisitos.filter((r) => r !== requisito));
  };

  const addOpcion = () => {
    const trimmed = opcionInput.trim();
    if (trimmed && !preguntaOpciones.includes(trimmed)) {
      setPreguntaOpciones([...preguntaOpciones, trimmed]);
    }
    setOpcionInput("");
  };

  const removeOpcion = (opcion) => {
    setPreguntaOpciones(preguntaOpciones.filter((o) => o !== opcion));
  };

  const addPregunta = (texto) => {
    const t = (texto || preguntaTexto).trim();
    if (!t) return;

    const nueva = {
      id: `p-${Date.now()}`,
      texto: t,
      tipo: preguntaTipo,
      ...(preguntaTipo === "multiple" && preguntaOpciones.length > 0 ? { opciones: [...preguntaOpciones] } : {}),
    };

    setPreguntas([...preguntas, nueva]);
    setPreguntaTexto("");
    setPreguntaOpciones([]);
    setOpcionInput("");
    setShowPreguntasSuggestions(false);
  };

  const removePregunta = (id) => {
    setPreguntas(preguntas.filter((p) => p.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const oferta = {
      ...form,
      skills,
      requisitos,
      preguntas,
    };

    const existing = JSON.parse(localStorage.getItem("ofertas_creadas") || "[]");
    existing.push({ ...oferta, id: Date.now() });
    localStorage.setItem("ofertas_creadas", JSON.stringify(existing));

    setSuccess(true);
    setTimeout(() => router.push("/dashboard/reclutador"), 1500);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <Check size={32} className="text-green-600" weight="bold" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Oferta publicada exitosamente</h3>
        <p className="text-slate-500">Redirigiendo al dashboard...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition"
      >
        <ArrowLeft size={16} /> Volver
      </button>

      <GlassCard className="p-6 space-y-6">
        <h3 className="text-lg font-bold text-slate-800">Información básica</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Título de la oferta</label>
            <input
              type="text"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              placeholder="Ej: Desarrollador Backend Python"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Empresa</label>
            <input
              type="text"
              name="empresa"
              value={form.empresa}
              onChange={handleChange}
              placeholder="Ej: Tech Solutions"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Ubicación</label>
            <input
              type="text"
              name="ubicacion"
              value={form.ubicacion}
              onChange={handleChange}
              placeholder="Ej: Caracas (Híbrido)"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Modalidad</label>
            <select
              name="modalidad"
              value={form.modalidad}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            >
              <option value="Remoto">Remoto</option>
              <option value="Híbrido">Híbrido</option>
              <option value="Presencial">Presencial</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Salario</label>
          <input
            type="text"
            name="salario"
            value={form.salario}
            onChange={handleChange}
            placeholder="Ej: $2000 - $3000 mensuales"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Describe las responsabilidades y detalles del puesto..."
            rows={4}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
          />
        </div>
      </GlassCard>

      <GlassCard className="p-6 space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Skills requeridos</h3>

        <div className="flex flex-wrap gap-2 mb-3">
          {skills.map((skill) => (
            <span key={skill} className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
              {skill}
              <button type="button" onClick={() => removeSkill(skill)} className="hover:text-indigo-900 transition">
                <X size={14} weight="bold" />
              </button>
            </span>
          ))}
        </div>

        <div className="relative">
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => {
                setSkillInput(e.target.value);
                setShowSkillsSuggestions(true);
              }}
              onFocus={() => setShowSkillsSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill(skillInput);
                }
              }}
              placeholder="Agregar skill y presionar Enter"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
            <Button type="button" variant="primary" size="sm" onClick={() => addSkill(skillInput)}>
              <Plus size={16} weight="bold" />
            </Button>
          </div>

          {showSkillsSuggestions && skillInput.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white rounded-xl border border-slate-200 shadow-lg p-2 max-h-40 overflow-y-auto">
              {SKILLS_SUGERIDOS
                .filter((s) => s.toLowerCase().includes(skillInput.toLowerCase()) && !skills.includes(s))
                .slice(0, 5)
                .map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => addSkill(s)}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition"
                  >
                    {s}
                  </button>
                ))}
            </div>
          )}
        </div>
      </GlassCard>

      <GlassCard className="p-6 space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Requisitos</h3>

        <div className="flex flex-wrap gap-2 mb-3">
          {requisitos.map((req) => (
            <span key={req} className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium">
              {req}
              <button type="button" onClick={() => removeRequisito(req)} className="hover:text-emerald-900 transition">
                <X size={14} weight="bold" />
              </button>
            </span>
          ))}
        </div>

        <div className="relative">
          <div className="flex gap-2">
            <input
              type="text"
              value={requisitoInput}
              onChange={(e) => {
                setRequisitoInput(e.target.value);
                setShowRequisitosSuggestions(true);
              }}
              onFocus={() => setShowRequisitosSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addRequisito(requisitoInput);
                }
              }}
              placeholder="Agregar requisito y presionar Enter"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
            <Button type="button" variant="primary" size="sm" onClick={() => addRequisito(requisitoInput)}>
              <Plus size={16} weight="bold" />
            </Button>
          </div>

          {showRequisitosSuggestions && requisitoInput.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white rounded-xl border border-slate-200 shadow-lg p-2 max-h-40 overflow-y-auto">
              {REQUISITOS_SUGERIDOS
                .filter((r) => r.toLowerCase().includes(requisitoInput.toLowerCase()) && !requisitos.includes(r))
                .slice(0, 5)
                .map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => addRequisito(r)}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition"
                  >
                    {r}
                  </button>
                ))}
            </div>
          )}
        </div>
      </GlassCard>

      <GlassCard className="p-6 space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Preguntas para candidatos</h3>

        {preguntas.length > 0 && (
          <div className="space-y-3">
            {preguntas.map((p, index) => (
              <div key={p.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800 font-medium">{p.texto}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 bg-slate-200 text-slate-600 rounded font-medium">
                      {p.tipo === "texto" ? "Texto libre" : p.tipo === "si-no" ? "Sí / No" : "Opción múltiple"}
                    </span>
                    {p.opciones && p.opciones.length > 0 && (
                      <span className="text-xs text-slate-500">{p.opciones.length} opciones</span>
                    )}
                  </div>
                </div>
                <button type="button" onClick={() => removePregunta(p.id)} className="flex-shrink-0 text-slate-400 hover:text-red-500 transition">
                  <X size={16} weight="bold" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3 pt-2 border-t border-slate-100">
          <input
            type="text"
            value={preguntaTexto}
            onChange={(e) => {
              setPreguntaTexto(e.target.value);
              setShowPreguntasSuggestions(true);
            }}
            onFocus={() => setShowPreguntasSuggestions(true)}
            placeholder="Escribe una pregunta para los candidatos..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />

          {showPreguntasSuggestions && preguntaTexto.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-2 max-h-36 overflow-y-auto">
              {PREGUNTAS_SUGERIDAS
                .filter((p) => p.toLowerCase().includes(preguntaTexto.toLowerCase()) && !preguntas.some((pq) => pq.texto.toLowerCase() === p.toLowerCase()))
                .slice(0, 5)
                .map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => addPregunta(p)}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition flex items-center gap-2"
                  >
                    <ListDashes size={14} /> {p}
                  </button>
                ))}
            </div>
          )}

          <div className="flex gap-2">
            <div className="relative flex-1">
              <select
                value={preguntaTipo}
                onChange={(e) => setPreguntaTipo(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition pr-8"
              >
                <option value="texto">Texto libre</option>
                <option value="si-no">Sí / No</option>
                <option value="multiple">Opción múltiple</option>
              </select>
              <CaretDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <Button type="button" variant="primary" size="sm" onClick={() => addPregunta()} disabled={!preguntaTexto.trim()}>
              <Plus size={16} weight="bold" /> Agregar
            </Button>
          </div>

          {preguntaTipo === "multiple" && (
            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold text-slate-500">Opciones de respuesta</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {preguntaOpciones.map((op) => (
                  <span key={op} className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium">
                    {op}
                    <button type="button" onClick={() => removeOpcion(op)} className="hover:text-amber-900 transition">
                      <X size={12} weight="bold" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={opcionInput}
                  onChange={(e) => setOpcionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addOpcion();
                    }
                  }}
                  placeholder="Agregar opción y presionar Enter"
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
                <Button type="button" variant="ghost" size="sm" onClick={addOpcion} disabled={!opcionInput.trim()}>
                  <Plus size={14} weight="bold" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </GlassCard>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" size="lg">
          Publicar Oferta
        </Button>
      </div>
    </form>
  );
}
