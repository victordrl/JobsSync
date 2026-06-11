"use client";

import { useState } from "react";
import { Brain, SquaresFour, User, ChartBar, SignOut } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "dashboard", icon: SquaresFour, label: "Dashboard" },
  { id: "perfil", icon: User, label: "Mi Perfil Parseado" },
];

export function SidebarCandidato({ activeTab, onTabChange, profile }) {
  const router = useRouter();
  const userName = profile?.nombre || "Candidato";
  const userInitials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="w-72 bg-white border-r border-slate-200 hidden md:flex flex-col z-20">
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="bg-blue-600 text-white p-1.5 rounded-lg">
          <Brain size={28} weight="bold" />
        </div>
        <span className="text-xl font-bold text-slate-800">IA-Matcher</span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Principal
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all w-full text-left",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 text-sm font-medium transition-all w-full text-left">
          <ChartBar size={20} />
          Analytics
        </button>
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            {userInitials}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{userName}</p>
            <p className="text-xs text-slate-500">Candidato</p>
          </div>
        </div>
        <button
          onClick={() => router.push("/")}
          className="mt-4 w-full flex items-center justify-center gap-2 text-slate-500 hover:text-red-500 text-sm font-medium transition"
        >
          <SignOut size={16} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
