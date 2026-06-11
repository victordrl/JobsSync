"use client";

import { useRef, useState, useCallback } from "react";
import { CloudArrowUp, FilePdf, File } from "@phosphor-icons/react";
import { Button } from "./Button";

export function FileDropZone({ onUpload }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFile = useCallback(
    (file) => {
      if (!file) return;
      const ext = file.name.split(".").pop().toLowerCase();
      if (!["pdf", "docx"].includes(ext)) {
        alert("Solo se aceptan archivos PDF o DOCX.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("El archivo no puede superar los 5MB.");
        return;
      }
      setSelectedFile(file);
      onUpload(file);
    },
    [onUpload]
  );

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className={`border-3 border-dashed rounded-2xl p-12 transition-all cursor-pointer group ${
        dragOver
          ? "border-blue-500 bg-blue-50"
          : "border-slate-200 hover:border-blue-500 hover:bg-blue-50"
      }`}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        className="hidden"
        onChange={handleInputChange}
      />

      <div className="group-hover:scale-110 transition-transform duration-300 flex flex-col items-center">
        {selectedFile ? (
          <File
            size={64}
            className="text-blue-500 mb-4"
            weight="thin"
          />
        ) : (
          <FilePdf
            size={64}
            className="text-slate-300 group-hover:text-blue-500 mb-4"
            weight="thin"
          />
        )}
        <p className="text-lg font-medium text-slate-700">
          {selectedFile
            ? selectedFile.name
            : "Arrastra tu CV aquí o haz clic para buscar"}
        </p>
        <p className="text-sm text-slate-400 mt-2">
          {selectedFile
            ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
            : "Soporta PDF y DOCX (Máx 5MB)"}
        </p>
        <Button variant="primary" size="md" className="mt-6">
          {selectedFile ? "Cambiar archivo" : "Seleccionar Archivo"}
        </Button>
      </div>
    </div>
  );
}
