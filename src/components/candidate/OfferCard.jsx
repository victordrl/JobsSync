"use client";

import { Badge } from "@/components/ui/Badge";
import { GaugeCircle } from "@/components/ui/GaugeCircle";

const borderColorMap = {
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  red: "bg-red-500",
};

export function OfferCard({ oferta, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 cursor-pointer relative overflow-hidden group card-hover"
    >
      <div className={`absolute left-0 top-0 w-1 h-full ${borderColorMap[oferta.color]}`}></div>
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <div
            className={`w-12 h-12 rounded-lg ${oferta.bgColor} text-white flex items-center justify-center font-bold text-lg`}
          >
            {oferta.iniciales}
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
              {oferta.titulo}
            </h4>
            <p className="text-slate-500 text-sm">
              {oferta.empresa} &bull; {oferta.ubicacion}
            </p>
            <div className="flex gap-2 mt-3">
              {oferta.skills.map((skill) => (
                <Badge key={skill} text={skill} />
              ))}
            </div>
          </div>
        </div>
        <div className="text-center">
          <GaugeCircle percentage={oferta.score} color={oferta.color} />
        </div>
      </div>
    </div>
  );
}
