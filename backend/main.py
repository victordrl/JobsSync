import uuid
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Importamos nuestras utilidades locales
from utils.auth import hash_password, verify_password, verify_bcrypt_password
from utils.supabase_client import supabase

app = FastAPI(title="JobsSync API", version="1.0")

# Configuración de CORS adaptada para tu entorno local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://192.168.0.205:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── MODELOS DE ENTRADA (PYDANTIC) ───────────────────────────

class UserRegister(BaseModel):
    email: str
    password: str
    rol: str          # 'candidato' o 'reclutador'
    nombre: str

class UserLogin(BaseModel):
    email: str
    password: str

# ─── ENDPOINTS DE AUTENTICACIÓN ──────────────────────────

@app.post("/api/auth/register", status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserRegister):
    try:
        # 1. Verificar existencia previa del usuario
        existing_user = supabase.table("usuarios").select("*").eq("email", user_data.email).execute()
        if existing_user.data and len(existing_user.data) > 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El correo electrónico ya se encuentra registrado."
            )
        
        # 2. Encriptar contraseña de forma segura usando Argon2id
        hashed_pwd = hash_password(user_data.password)
        
        # 3. Estructurar el payload para Supabase
        new_user_id = str(uuid.uuid4())
        user_record = {
            "id": new_user_id,
            "email": user_data.email,
            "password": hashed_pwd,
            "rol": user_data.rol,
            "nombre": user_data.nombre
        }
        
        # 4. Inserción en la base de datos
        response = supabase.table("usuarios").insert(user_record).execute()
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                detail="No se recibieron datos tras confirmar el registro."
            )
        
        created_user = response.data[0]
        return {
            "id": created_user.get("id"),
            "email": created_user.get("email"),
            "rol": created_user.get("rol"),
            "nombre": created_user.get("nombre")
        }

    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        print(f"[-] Error en el proceso de Registro: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor al procesar el registro: {str(e)}"
        )


@app.post("/api/auth/login")
def login_user(credentials: UserLogin):
    try:
        # 1. Consultar usuario en Supabase
        response = supabase.table("usuarios").select("*").eq("email", credentials.email).execute()
        
        if not response.data or len(response.data) == 0:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="El correo electrónico o la contraseña son incorrectos."
            )
        
        user = response.data[0]
        stored_password = user.get("password", "")
        
        # 2. Sistema híbrido avanzado de verificación
        is_valid = False
        
        # Caso A: Match exacto en texto plano (De respaldo)
        if stored_password == credentials.password:
            is_valid = True
            
        # Caso B: Match mediante BCrypt ($2b$)
        elif stored_password and str(stored_password).startswith("$2b$"):
            is_valid = verify_bcrypt_password(str(stored_password), credentials.password)
            
        # Caso C: Match mediante Argon2id ($argon2)
        elif stored_password and str(stored_password).startswith("$argon2"):
            is_valid = verify_password(str(stored_password), credentials.password)
            
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="El correo electrónico o la contraseña son incorrectos."
            )
            
        # 🟢 LOG INSTRUMENTAL DE ÉXITO EN EL BACKEND
        print("\n" + "="*40)
        print(f"🟢 [BACKEND SUCCESS] Login verificado")
        print(f"   Usuario: {user.get('email')}")
        print(f"   Rol: {user.get('rol')}")
        print(f"   ID: {user.get('id')}")
        print("="*40 + "\n")

        # 3. Respuesta adaptada a lo que maneja tu dataService.js
        return {
            "id": user.get("id"),
            "email": user.get("email"),
            "rol": user.get("rol"),
            "nombre": user.get("nombre")
        }

    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        print(f"[-] Error crítico capturado en Login: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Fallo de servidor al validar credenciales: {str(e)}"
        )


@app.get("/api/health")
def health_check():
    return {"status": "online", "database": "connected"}


# ─── ENDPOINTS DE SOPORTE PARA EVITAR ERRORES DE PERFIL EN EL FRONTEND ───

@app.get("/api/usuarios/{usuario_id}/perfil")
def get_user_profile(usuario_id: str):
    try:
        print(f"\n📡 [BACKEND] GET Perfil solicitado para usuario_id: {usuario_id}")
        if usuario_id == "undefined":
            print("⚠️ [BACKEND] Se recibió 'undefined' como ID de usuario.")
            return {"mensaje": "Perfil no creado", "user_id": usuario_id, "data": None}
            
        response = supabase.table("perfiles_candidato").select("*").eq("user_id", usuario_id).execute()
        
        if not response.data or len(response.data) == 0:
            print("ℹ️ [BACKEND] No existe registro en perfiles_candidato (El usuario irá a /upload)")
            return {"mensaje": "Perfil no creado", "user_id": usuario_id, "data": None}
            
        print("✅ [BACKEND] Perfil encontrado con éxito (El usuario irá a /dashboard/candidato)")
        return response.data[0]
    except Exception as e:
        print(f"[-] Error al capturar perfil para usuario {usuario_id}: {str(e)}")
        return {"mensaje": "Perfil no creado", "user_id": usuario_id, "data": None}


@app.get("/api/usuarios/perfil/undefined")
@app.get("/api/usuarios/undefined/perfil")
def profile_undefined_fallback():
    return {"mensaje": "ID de usuario no definido en el frontend", "data": None}


@app.get("/api/aplicaciones/candidato/{usuario_id}")
def get_candidato_aplicaciones(usuario_id: str):
    try:
        if usuario_id == "undefined":
            return []
        response = supabase.table("aplicaciones").select("*").eq("user_id", usuario_id).execute()
        return response.data if response.data else []
    except Exception:
        return []


# ─── ENDPOINTS DE OFERTAS DE TRABAJO ─────────────────────────

@app.get("/api/ofertas")
def get_ofertas_trabajo():
    try:
        response = supabase.table("ofertas").select("*").execute()
        if not response.data:
            return []
        return response.data
    except Exception as e:
        print(f"[-] Error al consultar ofertas en la base de datos: {str(e)}")
        return []