import { CheckCircle } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/Badge";
import { perfilCandidato } from "@/data/candidatos";

export function ProfileInfo() {
  const p = perfilCandidato;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
        <h3 className="text-2xl font-bold text-slate-900">Datos Extraídos del CV</h3>
        <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-bold flex items-center gap-2">
          <CheckCircle size={16} weight="fill" /> Parsing Exitoso
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
            Información Personal
          </h4>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500">Nombre Completo</p>
              <p className="font-medium text-slate-900">{p.nombre}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500">Email</p>
              <p className="font-medium text-slate-900">{p.email}</p>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
            Educación Detectada
          </h4>
          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
            <p className="font-bold text-indigo-900">{p.educacion}</p>
            <p className="text-sm text-indigo-700">{p.universidad}</p>
            <p className="text-xs text-indigo-500 mt-2">{p.periodo}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
