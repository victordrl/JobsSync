"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, User, Briefcase } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { getDataService } from "@/lib/dataService";

export default function RoleSelectionPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const user = getDataService().getCurrentUser();
    setIsChecking(false);
    if (user) {
      if (user.rol === "reclutador") {
        router.replace("/dashboard/reclutador");
      } else {
        const profile = getDataService().getProfileByUserId(user.id);
        router.replace(profile ? "/dashboard/candidato" : "/upload");
      }
    }
  }, [router]);

  const goToLogin = (rolHint) => {
    router.push(`/login?rol=${rolHint}`);
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative p-6">
      <button
        onClick={() => router.push("/")}
        className="absolute top-8 left-8 text-slate-500 hover:text-slate-900 flex items-center gap-2 transition"
      >
        <ArrowLeft size={20} weight="bold" /> Volver
      </button>

      <div className="text-center w-full max-w-5xl">
        <h2 className="text-4xl font-bold text-slate-900 mb-4 animate-slide-up">
          Selecciona tu Rol
        </h2>
        <p className="text-slate-500 mb-12 animate-slide-up">
          Inicia sesión o regístrate para continuar.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <button
            onClick={() => goToLogin("candidato")}
            className="group relative bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl border border-slate-100 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden text-left animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <User size={32} weight="fill" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Soy Candidato
              </h3>
              <p className="text-slate-500 mb-6">
                Sube tu CV para que nuestra IA analice tus skills y encuentre
                ofertas compatibles.
              </p>
              <span className="text-blue-600 font-semibold flex items-center gap-2 group-hover:gap-4 transition-all">
                Acceder <ArrowRightSmall />
              </span>
            </div>
          </button>

          <button
            onClick={() => goToLogin("reclutador")}
            className="group relative bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl border border-slate-100 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden text-left animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Briefcase size={32} weight="fill" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Soy Reclutador
              </h3>
              <p className="text-slate-500 mb-6">
                Gestiona ofertas y deja que el algoritmo clasifique a los
                mejores candidatos por ti.
              </p>
              <span className="text-indigo-600 font-semibold flex items-center gap-2 group-hover:gap-4 transition-all">
                Acceder <ArrowRightSmall />
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function ArrowRightSmall() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 8h12M7 2l6 6-6 6" />
    </svg>
  );
}
