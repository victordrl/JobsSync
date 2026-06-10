"use client";

import { ArrowLeft, CloudArrowUp } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { FileDropZone } from "@/components/ui/FileDropZone";

export default function UploadPage() {
  const router = useRouter();

  const handleUpload = () => {
    router.push("/loading");
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
            Analizar Currículum
          </h2>
          <p className="text-slate-500 mt-2">
            El motor spaCy + Transformers procesará tu documento.
          </p>
        </div>

        <FileDropZone onUpload={handleUpload} />
      </div>
    </div>
  );
}
