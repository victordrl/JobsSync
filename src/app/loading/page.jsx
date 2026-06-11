"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Brain } from "@phosphor-icons/react";
import { TerminalSimulator } from "@/components/ui/TerminalSimulator";
import { getDataService } from "@/lib/dataService";

export default function LoadingPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const user = getDataService().getCurrentUser();
    if (!user) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (ready) {
      router.push("/dashboard/candidato");
    }
  }, [ready, router]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(#4f46e5 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      ></div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <Brain size={32} weight="fill" className="animate-pulse" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Procesando Inteligencia Artificial
        </h2>

        <TerminalSimulator />
      </div>
    </div>
  );
}
