import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

# 1. Encontrar la ruta absoluta de la raíz del proyecto (subiendo dos niveles desde este archivo)
# supabase_client.py -> utils/ -> backend/ -> raíz (donde está el .env)
BASE_DIR = Path(__file__).resolve().parent.parent.parent
env_path = BASE_DIR / ".env"

# 2. Cargar explícitamente el archivo usando su ruta absoluta verificada
load_dotenv(dotenv_path=env_path)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    # Agregamos la ruta impresa al error para saber exactamente dónde está buscando si falla
    raise ValueError(f"Faltan las variables de entorno en el archivo .env. Buscado en: {env_path}")

# Instancia única del cliente
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)