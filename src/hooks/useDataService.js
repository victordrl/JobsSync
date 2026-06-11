"use client";

import { useState, useCallback, useEffect } from "react";
import { getDataService } from "@/lib/dataService";

const listeners = new Set();

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

export function useDataService() {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const handler = () => setVersion((v) => v + 1);
    listeners.add(handler);
    return () => listeners.delete(handler);
  }, []);

  const db = getDataService();

  const login = useCallback(
    (email, password) => {
      const user = db.login(email, password);
      notifyListeners();
      return user;
    },
    [db]
  );

  const register = useCallback(
    (userData) => {
      const user = db.register(userData);
      notifyListeners();
      return user;
    },
    [db]
  );

  const logout = useCallback(() => {
    db.logout();
    notifyListeners();
  }, [db]);

  const refresh = useCallback(() => {
    notifyListeners();
  }, []);

  return { db, login, register, logout, refresh, version };
}
