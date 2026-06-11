"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarReclutador } from "@/components/layout/SidebarReclutador";
import { OfferForm } from "@/components/recruiter/OfferForm";
import { getDataService } from "@/lib/dataService";

export default function NuevaOfertaPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getDataService().getCurrentUser();
    if (!user || user.rol !== "reclutador") {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <SidebarReclutador />

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white sticky top-0 z-10 border-b border-slate-200 px-8 py-4">
          <h2 className="text-2xl font-bold text-slate-800">Publicar Nueva Oferta</h2>
          <p className="text-sm text-slate-500 mt-1">Completa la información para crear una nueva oferta de empleo</p>
        </header>

        <div className="p-8">
          <OfferForm />
        </div>
      </main>
    </div>
  );
}
