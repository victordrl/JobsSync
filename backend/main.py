import os
from fastapi import FastAPI
import psycopg2
from pydantic_settings import BaseSettings

# Configuración de variables de entorno
# Configuración de variables de entorno
class Settings(BaseSettings):
    database_url: str
    project_name: str
    version: str
    class Config:
        env_file = ".env"
        extra = "ignore"  # <--- ESTA LÍNEA le dice a Pydantic: "si hay más datos en el .env, no te rompas, solo ignóralos"
settings = Settings()

app = FastAPI(title=settings.project_name)

@app.get("/")
def home():
    return {"status": "Online", "proyecto": settings.project_name}

@app.get("/test-db")
def test_database_connection():
    try:
        # Intentar conectar con el Connection String de Supabase
        conn = psycopg2.connect(settings.database_url)
        cursor = conn.cursor()
        
        # Consultar si nuestras tablas de prueba existen
        cursor.execute("SELECT id_archivo, nombre_archivo, categoria FROM archivos;")
        archivo_prueba = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        return {
            "database_status": "Conectado con éxito a Supabase (AWS Ohio)",
            "registro_encontrado": {
                "id": archivo_prueba[0],
                "nombre": archivo_prueba[1],
                "categoria": archivo_prueba[2]
            }
        }
    except Exception as e:
        return {"database_status": "Error de conexión", "error": str(e)}