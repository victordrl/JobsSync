import bcrypt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

# Instancia global para nuevos registros (Argon2id)
ph = PasswordHasher()

def hash_password(password: str) -> str:
    """Genera un hash seguro utilizando Argon2id para nuevos registros."""
    return ph.hash(password)

def verify_password(hash_str: str, password: str) -> bool:
    """Verifica si una contraseña coincide con un hash de Argon2id."""
    try:
        return ph.verify(hash_str, password)
    except VerifyMismatchError:
        return False
    except Exception:
        return False

def verify_bcrypt_password(hash_str: str, password: str) -> bool:
    """Verifica si una contraseña coincide con los hashes de BCrypt antiguos ($2b$)."""
    try:
        # bcrypt requiere que los strings estén codificados en bytes
        return bcrypt.checkpw(password.encode('utf-8'), hash_str.encode('utf-8'))
    except Exception:
        return False