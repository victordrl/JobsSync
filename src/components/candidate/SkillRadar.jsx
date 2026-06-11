import { Badge } from "@/components/ui/Badge";

const NIVEL_COLOR = {
  básico: "gray",
  intermedio: "blue",
  avanzado: "indigo",
  experto: "green",
};

function generatePolygonPoints(count, cx = 50, cy = 50, radius = 35) {
  if (count === 0) return "";
  const points = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return points.join(" ");
}

function generateInnerPoints(count, cx = 50, cy = 50, radius = 25) {
  if (count === 0) return "";
  const points = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return points.join(" ");
}

function generateLabels(hardSkills, cx = 50, cy = 50, radius = 42) {
  return hardSkills.map((s, i) => {
    const angle = (Math.PI * 2 * i) / hardSkills.length - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    const posX = x > cx ? "left" : "right";
    const posY = y > cy ? "top" : "bottom";
    return { nombre: s.nombre, x, y, posX, posY };
  });
}

export function SkillRadar({ profile }) {
  const hardSkills = profile?.hard_skills || [];
  const softSkills = profile?.soft_skills || [];
  const count = hardSkills.length;

  if (count === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
        <h4 className="font-bold text-slate-800 mb-6">Mapa de Competencias</h4>
        <p className="text-sm text-slate-400 py-8">No hay habilidades para mostrar.</p>
      </div>
    );
  }

  const outerPoints = generatePolygonPoints(count);
  const innerPoints = generateInnerPoints(count);
  const labels = generateLabels(hardSkills);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
      <h4 className="font-bold text-slate-800 mb-6">Mapa de Competencias</h4>
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
          <polygon
            points={outerPoints}
            fill="#eff6ff"
            stroke="#bfdbfe"
            strokeWidth="1"
          />
          {count >= 3 && (
            <polygon
              points={innerPoints}
              fill="rgba(79, 70, 229, 0.4)"
              stroke="#4338ca"
              strokeWidth="2"
            />
          )}
        </svg>
        {labels.map((l) => (
          <span
            key={l.nombre}
            className="absolute text-xs font-bold text-slate-500"
            style={{
              left: `${l.x}%`,
              top: `${l.y}%`,
              transform: `translate(-50%, -50%)`,
            }}
          >
            {l.nombre}
          </span>
        ))}
      </div>

      <div className="mt-6 w-full space-y-3">
        <p className="text-sm font-semibold text-slate-700">
          Habilidades Técnicas:
        </p>
        <div className="flex flex-wrap gap-2">
          {hardSkills.map((s) => (
            <Badge
              key={s.nombre}
              text={`${s.nombre} (${s.nivel || "—"})`}
              color={NIVEL_COLOR[s.nivel] || "slate"}
              variant="soft"
            />
          ))}
        </div>

        {softSkills.length > 0 && (
          <>
            <p className="text-sm font-semibold text-slate-700 mt-4">
              Habilidades Blandas:
            </p>
            <div className="flex flex-wrap gap-2">
              {softSkills.map((s) => (
                <Badge
                  key={s.nombre}
                  text={s.nombre}
                  color="green"
                  variant="soft"
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
