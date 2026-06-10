"use client";

import { Brain } from "@phosphor-icons/react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Navbar() {
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
        <div className="hidden md:flex items-center gap-8">
          <Link href="/role-selection">
            <Button variant="secondary" size="md">
              Probar Demo
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
