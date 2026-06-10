"use client";

import { useState, useEffect, useCallback } from "react";
import { terminalLogs } from "@/data/terminal-logs";

export function useTerminalSimulation() {
  const [lines, setLines] = useState([]);
  const [done, setDone] = useState(false);
  const [visibleLogs, setVisibleLogs] = useState([]);

  const run = useCallback(() => {
    setLines([]);
    setVisibleLogs([]);
    setDone(false);

    terminalLogs.forEach((log) => {
      setTimeout(() => {
        setLines((prev) => [...prev, log.text]);
      }, log.delay);
    });

    const totalDelay = terminalLogs[terminalLogs.length - 1].delay + 500;

    setTimeout(() => {
      setDone(true);
    }, totalDelay);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLogs((prev) => {
        if (prev.length < lines.length) {
          return [...prev, lines[prev.length]];
        }
        clearInterval(interval);
        return prev;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [lines]);

  return { visibleLogs, done, run };
}
