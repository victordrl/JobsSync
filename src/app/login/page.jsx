"use client";

// Polyfill para habilitar crypto.randomUUID en redes locales HTTP (192.168.x.x)
if (typeof window !== "undefined" && window.crypto && !window.crypto.randomUUID) {
  window.crypto.randomUUID = function () {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };
}

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Brain, User, Briefcase, Eye, EyeSlash, ArrowLeft } from "@phosphor-icons/react";
import { useDataService } from "@/hooks/useDataService";
import { ROLES } from "@/data/schemas";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { db } = useDataService(); 
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    nombre: "",
    rol: ROLES.CANDIDATO,
  });

  const [apiUrl, setApiUrl] = useState("http://localhost:8000/api");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      setApiUrl(`http://${hostname}:8000/api`);
    }
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Completa todos los campos.");
      return;
    }

    setLoading(true);
    printLog("🚀 [PASO 1] Formulario enviado. Iniciando petición fetch a login...");

    try {
      if (mode === "login") {
        const response = await fetch(`${apiUrl}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Credenciales inválidas.");
        }

        printLog("🚨 [PASO 2] Respuesta de API recibida con éxito:", data);

        localStorage.setItem("user", JSON.stringify(data));
        printLog("💾 [PASO 3] Objeto 'user' inyectado en localStorage.");
        
        if (db && typeof db.setUser === "function") {
          db.setUser(data);
          printLog("🎯 [PASO 4] db.setUser asignado exitosamente en Contexto Global.");
        } else {
          printLog("⚠️ [ALERTA] 'db' o 'db.setUser' no existen en useDataService.");
        }

        printLog("🔀 [PASO 5] Invocando sub-rutina de redirección...");
        await redirectAfterLogin(data);

      } else {
        if (!form.nombre) {
          setError("Completa todos los campos.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${apiUrl}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
            nombre: form.nombre,
            rol: form.rol,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Error al procesar el registro.");
        }

        localStorage.setItem("user", JSON.stringify(data));

        if (db && typeof db.setUser === "function") {
          db.setUser(data);
        }

        if (form.rol === ROLES.CANDIDATO) {
          router.push("/upload");
        } else {
          router.push("/dashboard/reclutador");
        }
      }
    } catch (err) {
      printLog("❌ [ERROR DETECTADO] Excepción en handleSubmit:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const redirectAfterLogin = async (user) => {
    const userRole = user.rol || user.role;
    printLog(`🔍 [PASO 6] redirectAfterLogin activo. Rol detectado: "${userRole}"`);
    
    setTimeout(async () => {
      if (userRole === ROLES.RECLUTADOR || userRole === "reclutador") {
        printLog("➡️ [PASO 7-R] Ejecutando router.push('/dashboard/reclutador')");
        router.push("/dashboard/reclutador");
      } else {
        try {
          printLog(`📡 [PASO 7-C] Solicitando verificación de perfil a: ${apiUrl}/usuarios/${user.id}/perfil`);
          const profileRes = await fetch(`${apiUrl}/usuarios/${user.id}/perfil`);
          const profileData = await profileRes.json();

          printLog("📦 [PASO 8-C] Respuesta de datos de perfil devuelta:", profileData);

          if (profileRes.ok && profileData && (profileData.id || profileData.user_id) && !profileData.mensaje) {
            printLog("➡️ [PASO 9-C] Perfil verificado existente. Ejecutando router.push('/dashboard/candidato')");
            router.push("/dashboard/candidato");
          } else {
            printLog("➡️ [PASO 9-C] Sin perfil previo en DB. Redirigiendo a router.push('/upload')");
            router.push("/upload");
          }
        } catch (err) {
          printLog("❌ [ERROR] Falló validación de perfil remota. Forzando fallback a /upload:", err);
          router.push("/upload");
        }
      }
    }, 100);
  };

  // Función interna auxiliar para pintar logs claros
  function printLog(title, content = "") {
    console.log(`%c${title}`, "background: #1e293b; color: #38bdf8; padding: 4px 8px; rounded: 4px;", content);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative">
      <button
        onClick={() => router.push("/role-selection")}
        className="absolute top-8 left-8 text-slate-500 hover:text-slate-900 flex items-center gap-2 transition"
        disabled={loading}
        type="button"
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
            {mode === "login" ? "Accede con tu email y contraseña" : "Regístrate para comenzar"}
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
                disabled={loading}
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
              disabled={loading}
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
                disabled={loading}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
            disabled={loading}
            className="w-full py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-75 disabled:scale-100"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : mode === "login" ? (
              "Entrar"
            ) : (
              "Crear Cuenta"
            )}
          </button>

          <p className="text-center text-sm text-slate-500">
            {mode === "login" ? (
              <>
                ¿No tienes cuenta?{" "}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => { setMode("register"); setError(""); }}
                  className="text-blue-600 font-semibold hover:underline disabled:no-underline"
                >
                  Regístrate
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{" "}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => { setMode("login"); setError(""); }}
                  className="text-blue-600 font-semibold hover:underline disabled:no-underline"
                >
                  Inicia sesión
                </button>
              </>
            )}
          </p>

          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center mb-3">Demo — credenciales de prueba</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                disabled={loading}
                onClick={() => setForm({ email: "admin", password: "admin" })}
                className="p-2 bg-slate-50 rounded-lg text-slate-600 hover:bg-slate-100 transition text-left"
              >
                <span className="font-semibold">Admin:</span> admin / admin
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => setForm({ email: "carlos", password: "carlos" })}
                className="p-2 bg-slate-50 rounded-lg text-slate-600 hover:bg-slate-100 transition text-left"
              >
                <span className="font-semibold">Candidato:</span> carlos / carlos
              </button>
            </div>
          </div>
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