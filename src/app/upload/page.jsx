"use client";

import { Suspense, useEffect } from "react";
import { ArrowLeft, CloudArrowUp } from "@phosphor-icons/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FileDropZone } from "@/components/ui/FileDropZone";
import { getDataService } from "@/lib/dataService";

function UploadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isReplace = searchParams.get("replace") === "true";

  useEffect(() => {
    const user = getDataService().getCurrentUser();
    if (!user || user.rol !== "candidato") {
      router.replace("/login");
    }
  }, [router]);

  const handleUpload = (file) => {
    if (!file) return;

    if (isReplace) {
      const user = getDataService().getCurrentUser();
      if (user) {
        const profiles = JSON.parse(localStorage.getItem("perfiles_candidato") || "[]");
        const idx = profiles.findIndex((p) => p.userId === user.id);
        if (idx >= 0) profiles.splice(idx, 1);
        localStorage.setItem("perfiles_candidato", JSON.stringify(profiles));
      }
    }

    sessionStorage.setItem(
      "pending_cv",
      JSON.stringify({
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
      })
    );

    const reader = new FileReader();
    reader.onload = (e) => {
      sessionStorage.setItem("pending_cv_data", e.target.result);
      router.push("/loading");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-10 text-center animate-slide-up relative">
        <button
          onClick={() => router.push("/role-selection")}
          className="absolute top-6 left-6 text-slate-400 hover:text-slate-800 transition"
        >
          <ArrowLeft size={20} weight="bold" />
        </button>

        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 text-blue-600 mb-4">
            <CloudArrowUp size={40} weight="duotone" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">
            {isReplace ? "Actualizar Currículum" : "Analizar Currículum"}
          </h2>
          <p className="text-slate-500 mt-2">
            {isReplace
              ? "Tu perfil actual será reemplazado por el nuevo análisis."
              : "Gemini IA analizará tu currículum y extraerá tus habilidades."}
          </p>
        </div>

        <FileDropZone onUpload={handleUpload} />
      </div>
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      }
    >
      <UploadContent />
    </Suspense>
  );
}
