"use client";

import Link from "next/link";
import { ArrowRight, FileText, UserFocus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
      <div className="md:w-1/2 animate-slide-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-bold mb-6">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          Potenciado con NLP & Machine Learning
        </div>
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-slate-900">
          El futuro del <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-violet-600">
            Reclutamiento Inteligente
          </span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg">
          Automatiza el análisis de CVs y elimina el sesgo humano. Nuestro algoritmo
          de emparejamiento semántico conecta el talento ideal con la oferta perfecta.
        </p>
        <div className="flex gap-4">
          <Link href="/role-selection">
            <Button variant="primary" size="lg" icon={<ArrowRight size={20} weight="bold" />}>
              Probar Demo
            </Button>
          </Link>
        </div>
      </div>

      <div className="md:w-1/2 relative animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <div className="relative w-full h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 to-purple-500"></div>
          <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="text-xs text-slate-400 font-mono">analysis_engine.py</div>
          </div>

          <div className="space-y-4">
            <div
              className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 animate-pulse"
              style={{ animationDuration: "4s" }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <FileText size={24} weight="fill" />
              </div>
              <div className="flex-1">
                <div className="h-2 bg-slate-200 rounded w-1/3 mb-2"></div>
                <div className="h-2 bg-slate-200 rounded w-1/2"></div>
              </div>
              <div className="text-green-600 font-bold text-sm">Analizando...</div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100 translate-x-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                <UserFocus size={24} weight="fill" />
              </div>
              <div className="flex-1">
                <div className="h-2 bg-indigo-200 rounded w-2/3 mb-2"></div>
                <div className="h-2 bg-indigo-200 rounded w-3/4"></div>
              </div>
              <div className="px-3 py-1 bg-white rounded-full text-indigo-700 text-xs font-bold shadow-sm">
                Match 92%
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 right-0 p-6 opacity-10 pointer-events-none">
            <pre className="font-mono text-xs">
              {`def calculate_similarity(cv, job):
    vector_a = nlp(cv).vector
    vector_b = nlp(job).vector
    return cosine_similarity(a, b)`}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}
