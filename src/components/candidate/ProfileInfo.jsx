import { CheckCircle, Code, Brain } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/Badge";

export function ProfileInfo({ profile }) {
  if (!profile) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
        <Brain size={48} className="mx-auto text-slate-300 mb-4" weight="light" />
        <h3 className="text-lg font-semibold text-slate-700 mb-2">No hay perfil disponible</h3>
        <p className="text-slate-500">Sube tu CV para que la IA analice tus habilidades.</p>
      </div>
    );
  }

  const hardSkills = profile.hard_skills || [];
  const softSkills = profile.soft_skills || [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Datos Extraídos del CV</h3>
          <p className="text-sm text-slate-500 mt-1">
            Procesado con {profile.processorVersion || "IA"} en{" "}
            {profile.processingTime ? `${(profile.processingTime / 1000).toFixed(1)}s` : "—"}
          </p>
        </div>
        <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-bold flex items-center gap-2">
          <CheckCircle size={16} weight="fill" /> Parsing Exitoso
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
            Información Personal
          </h4>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500">Nombre Completo</p>
              <p className="font-medium text-slate-900">{profile.nombre}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500">Email</p>
              <p className="font-medium text-slate-900">{profile.email}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500">Teléfono</p>
              <p className="font-medium text-slate-900">{profile.telefono || "—"}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500">Profesión</p>
              <p className="font-medium text-slate-900">{profile.profesion}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500">Experiencia</p>
              <p className="font-medium text-slate-900">{profile.experiencia_anios} años</p>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
            Habilidades Técnicas
          </h4>
          <div className="space-y-2">
            {hardSkills.length > 0 ? hardSkills.map((s) => (
              <div
                key={s.nombre}
                className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Code size={16} className="text-blue-600" />
                  <span className="font-medium text-blue-900">{s.nombre}</span>
                </div>
                <span className="text-xs px-2 py-0.5 bg-blue-200 text-blue-700 rounded font-medium">
                  {s.nivel}
                </span>
              </div>
            )) : (
              <p className="text-sm text-slate-400">No se detectaron habilidades técnicas.</p>
            )}
          </div>

          {softSkills.length > 0 && (
            <>
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mt-6 mb-4">
                Habilidades Blandas
              </h4>
              <div className="flex flex-wrap gap-2">
                {softSkills.map((s) => (
                  <Badge key={s.nombre} text={s.nombre} color="green" variant="soft" />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
