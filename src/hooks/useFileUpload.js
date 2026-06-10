"use client";

import { useState, useCallback } from "react";

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const iniciarAnalisis = useCallback(() => {
    setIsUploading(true);
  }, []);

  return { isUploading, iniciarAnalisis };
}
