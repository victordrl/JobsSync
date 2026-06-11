"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Brain, User, Briefcase, Eye, EyeSlash, ArrowLeft } from "@phosphor-icons/react";
import { useDataService } from "@/hooks/useDataService";
import { createUser, ROLES } from "@/data/schemas";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { db, login, register } = useDataService();
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
    nombre: "",
    rol: ROLES.CANDIDATO,
  });

  useEffect(() => {
    const rolHint = searchParams.get("rol");
    if (rolHint === "reclutador") {
      setForm((f) => ({ ...f, rol: ROLES.RECLUTADOR }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Completa todos los campos.");
      return;
    }

    if (mode === "login") {
      const user = login(form.email, form.password);
      if (!user) {
        setError("Credenciales inválidas.");
        return;
      }
      redirectAfterLogin(user);
    } else {
      if (!form.nombre) {
        setError("Completa todos los campos.");
        return;
      }
      const user = register(
        createUser({
          email: form.email,
          password: form.password,
          nombre: form.nombre,
          rol: form.rol,
        })
      );
      if (!user) {
        setError("El usuario ya existe.");
        return;
      }
      if (form.rol === ROLES.CANDIDATO) {
        router.push("/upload");
      } else {
        router.push("/dashboard/reclutador");
      }
    }
  };

  const redirectAfterLogin = (user) => {
    if (user.rol === ROLES.RECLUTADOR) {
      router.push("/dashboard/reclutador");
    } else {
      const profile = db.getProfileByUserId(user.id);
      if (profile) {
        router.push("/dashboard/candidato");
      } else {
        router.push("/upload");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative">
      <button
        onClick={() => router.push("/role-selection")}
        className="absolute top-8 left-8 text-slate-500 hover:text-slate-900 flex items-center gap-2 transition"
      >
        <ArrowLeft size={20} weight="bold" /> Volver
      </button>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl mb-4 shadow-lg">
            <Brain size={32} weight="bold" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">
            {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
          </h2>
          <p className="text-slate-500 mt-2">
            {mode === "login"
              ? "Accede con tu email y contraseña"
              : "Regístrate para comenzar"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 space-y-5"
        >
          {mode === "register" && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Nombre completo</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Email</label>
            <input
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {mode === "register" && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Rol</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, rol: ROLES.CANDIDATO })}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium transition ${
                    form.rol === ROLES.CANDIDATO
                      ? "bg-blue-50 border-blue-200 text-blue-700"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <User size={18} /> Candidato
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, rol: ROLES.RECLUTADOR })}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium transition ${
                    form.rol === ROLES.RECLUTADOR
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Briefcase size={18} /> Reclutador
                </button>
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-sm"
          >
            {mode === "login" ? "Entrar" : "Crear Cuenta"}
          </button>

          <p className="text-center text-sm text-slate-500">
            {mode === "login" ? (
              <>
                ¿No tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("register"); setError(""); }}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Regístrate
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("login"); setError(""); }}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Inicia sesión
                </button>
              </>
            )}
          </p>

          {mode === "login" && (
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400 text-center mb-3">Demo — credenciales de prueba</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setForm({ email: "admin", password: "admin" })}
                  className="p-2 bg-slate-50 rounded-lg text-slate-600 hover:bg-slate-100 transition text-left"
                >
                  <span className="font-semibold">Admin:</span> admin / admin
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ email: "carlos", password: "carlos" })}
                  className="p-2 bg-slate-50 rounded-lg text-slate-600 hover:bg-slate-100 transition text-left"
                >
                  <span className="font-semibold">Candidato:</span> carlos / carlos
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
