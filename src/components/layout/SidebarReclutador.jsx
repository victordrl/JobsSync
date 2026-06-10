"use client";

import { Briefcase, Users, PlusCircle, SignOut } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

export function SidebarReclutador() {
  const router = useRouter();

  return (
    <aside className="w-72 bg-slate-900 text-white hidden md:flex flex-col z-20">
      <div className="p-6 border-b border-slate-700 flex items-center gap-3">
        <div className="bg-indigo-500 text-white p-1.5 rounded-lg">
          <Briefcase size={28} weight="bold" />
        </div>
        <span className="text-xl font-bold">IA-Recruit</span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Gestión
        </p>
        <button
          onClick={() => router.push("/dashboard/reclutador")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-600 text-white text-sm font-medium transition-all shadow-lg shadow-indigo-900/50 text-left"
        >
          <Users size={20} />
          Ranking Candidatos
        </button>
        <button
          onClick={() => router.push("/dashboard/reclutador/ofertas/nueva")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white text-sm font-medium transition-all text-left"
        >
          <PlusCircle size={20} />
          Publicar Oferta
        </button>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={() => router.push("/")}
          className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition"
        >
          <SignOut size={16} />
          Salir
        </button>
      </div>
    </aside>
  );
}
