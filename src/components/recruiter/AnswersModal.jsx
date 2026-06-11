"use client";

import { ChatCircleText, WarningCircle, CheckCircle, Textbox } from "@phosphor-icons/react";
import { Modal } from "@/components/ui/Modal";

export function AnswersModal({ isOpen, onClose, candidato, ofertaTitulo, respuestas }) {
  if (!candidato) return null;

  const noAnswers = !respuestas || respuestas.respuestas?.length === 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={candidato.nombre}
      subtitle={`${candidato.titulo} — ${ofertaTitulo}`}
      gradientFrom={noAnswers ? "from-amber-600" : "from-violet-600"}
      gradientTo={noAnswers ? "to-orange-600" : "to-indigo-600"}
      icon={
        noAnswers ? (
          <WarningCircle size={28} weight="bold" className="text-white" />
        ) : (
          <ChatCircleText size={28} weight="bold" />
        )
      }
    >
      {noAnswers ? (
        <p className="text-center text-slate-500 py-8">
          Este candidato aún no ha respondido las preguntas.
        </p>
      ) : (
        <div className="space-y-4">
          {respuestas.respuestas.map((r, index) => (
            <div key={r.preguntaId} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-semibold text-slate-700">{r.pregunta}</p>
                  <div className="flex items-center gap-2">
                    {r.tipo === "si-no" && <CheckCircle size={14} className="text-emerald-500" />}
                    {r.tipo === "texto" && <Textbox size={14} className="text-blue-500" />}
                    <span className="text-sm text-slate-800 font-medium">{r.respuesta}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
