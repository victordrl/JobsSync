import { Badge } from "@/components/ui/Badge";

export function SkillRadar() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
      <h4 className="font-bold text-slate-800 mb-6">Mapa de Competencias</h4>
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
          <polygon
            points="50,10 90,35 75,80 25,80 10,35"
            fill="#eff6ff"
            stroke="#bfdbfe"
            strokeWidth="1"
          />
          <polygon
            points="50,20 80,40 70,70 30,70 20,40"
            fill="rgba(79, 70, 229, 0.4)"
            stroke="#4338ca"
            strokeWidth="2"
          />
        </svg>
        <span className="absolute top-0 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-500">
          Backend
        </span>
        <span className="absolute bottom-2 right-2 text-xs font-bold text-slate-500">
          IA/ML
        </span>
        <span className="absolute bottom-2 left-2 text-xs font-bold text-slate-500">
          DB
        </span>
      </div>
      <div className="mt-6 w-full">
        <p className="text-sm font-semibold text-slate-700 mb-2">
          Habilidades Destacadas:
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge text="Python" color="blue" />
          <Badge text="Machine Learning" color="indigo" />
          <Badge text="NLP" color="green" />
        </div>
      </div>
    </div>
  );
}
