"use client";

import { Eye, TrendUp, Minus } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/Badge";

const colorMap = {
  Python: "blue",
  NLP: "green",
  FastAPI: "indigo",
  Django: "gray",
  React: "blue",
  Tailwind: "green",
  TypeScript: "indigo",
  "Node.js": "gray",
  PostgreSQL: "blue",
};

export function CandidateTable({ candidatos, ofertasMap, onViewAnswers }) {
  const sorted = [...candidatos].sort((a, b) => b.score - a.score);

  if (sorted.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">No hay candidatos para mostrar.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
              <th className="p-6">Candidato</th>
              <th className="p-6">Oferta</th>
              <th className="p-6">Skills Clave</th>
              <th className="p-6 text-center">IA Match Score</th>
              <th className="p-6 text-center">Respuestas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((c) => (
              <tr key={`${c.id}-${c.ofertaId}`} className="hover:bg-slate-50 transition group">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${c.bgColor} flex items-center justify-center font-bold ${c.iniciales === "CM" ? "text-blue-700" : c.iniciales === "AO" ? "text-orange-700" : c.iniciales === "MG" ? "text-purple-700" : "text-teal-700"}`}
                    >
                      {c.iniciales}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{c.nombre}</p>
                      <p className="text-xs text-slate-500">{c.titulo}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <p className="text-sm text-slate-700 font-medium">{ofertasMap[c.ofertaId || 0] || "—"}</p>
                </td>
                <td className="p-6">
                  <div className="flex gap-1 flex-wrap">
                    {c.skills.map((skill) => {
                      return (
                        <Badge
                          key={skill}
                          text={skill}
                          color={colorMap[skill] || "slate"}
                        />
                      );
                    })}
                  </div>
                </td>
                <td className="p-6 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold border ${
                      c.scoreColor === "green"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-yellow-100 text-yellow-700 border-yellow-200"
                    }`}
                  >
                    {c.scoreColor === "green" ? (
                      <TrendUp size={14} weight="fill" />
                    ) : (
                      <Minus size={14} weight="fill" />
                    )}{" "}
                    {c.score}%
                  </span>
                </td>
                <td className="p-6 text-center">
                  <button
                    onClick={() => onViewAnswers(c)}
                    className="text-slate-400 hover:text-indigo-600 transition"
                    title="Ver respuestas"
                  >
                    <Eye size={20} weight="bold" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
