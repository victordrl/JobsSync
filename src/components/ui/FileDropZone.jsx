import { CloudArrowUp, FilePdf } from "@phosphor-icons/react";
import { Button } from "./Button";

export function FileDropZone({ onUpload }) {
  return (
    <div
      id="drop-zone"
      className="border-3 border-dashed border-slate-200 rounded-2xl p-12 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group"
      onClick={onUpload}
    >
      <div className="group-hover:scale-110 transition-transform duration-300 flex flex-col items-center">
        <FilePdf
          size={64}
          className="text-slate-300 group-hover:text-blue-500 mb-4"
          weight="thin"
        />
        <p className="text-lg font-medium text-slate-700">
          Arrastra tu CV aquí o haz clic para buscar
        </p>
        <p className="text-sm text-slate-400 mt-2">Soporta PDF y DOCX (Máx 5MB)</p>
        <Button variant="primary" size="md" className="mt-6">
          Seleccionar Archivo
        </Button>
      </div>
    </div>
  );
}
