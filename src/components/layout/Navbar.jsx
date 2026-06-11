"use client";

import { useState, useEffect } from "react";
import { Brain, SignOut } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { getDataService } from "@/lib/dataService";

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const check = () => setUser(getDataService().getCurrentUser());
    check();
    const interval = setInterval(check, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    getDataService().logout();
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="fixed w-full z-50 bg-white/70 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-linear-to-br from-blue-600 to-indigo-600 text-white p-2 rounded-lg shadow-lg">
            <Brain size={28} weight="bold" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-700">
            IA-Matcher
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-slate-500">{user.nombre}</span>
              <Link
                href={user.rol === "reclutador" ? "/dashboard/reclutador" : "/dashboard/candidato"}
              >
                <Button variant="secondary" size="sm">
                  Dashboard
                </Button>
              </Link>
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-500 transition p-2"
                title="Cerrar sesión"
              >
                <SignOut size={18} />
              </button>
            </>
          ) : (
            <Link href="/role-selection">
              <Button variant="secondary" size="md">
                Iniciar Sesión
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
