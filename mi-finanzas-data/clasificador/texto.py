"""Normalizacion compartida entre entrenamiento e inferencia."""

from __future__ import annotations

import re
import unicodedata


_ESPACIOS = re.compile(r"\s+")
_CARACTERES_NO_VALIDOS = re.compile(r"[^a-z0-9 ]+")

# Solo se excluyen al estimar cobertura lexica. El TF-IDF si conserva estas
# palabras porque algunas combinaciones (por ejemplo, "pago de sueldo") ayudan.
STOPWORDS_COBERTURA = {
    "a", "al", "con", "de", "del", "el", "en", "la", "las", "lo", "los",
    "mi", "mis", "para", "por", "su", "sus", "un", "una", "unos", "unas", "y",
}


def normalizar_texto(texto: object) -> str:
    """Normaliza mayusculas, tildes y puntuacion, conservando los digitos."""

    if texto is None:
        return ""
    valor = unicodedata.normalize("NFKD", str(texto).strip().lower())
    valor = "".join(c for c in valor if not unicodedata.combining(c))
    valor = _CARACTERES_NO_VALIDOS.sub(" ", valor)
    return _ESPACIOS.sub(" ", valor).strip()


def tokens_informativos(texto: object) -> list[str]:
    """Extrae tokens usados para detectar entradas fuera de vocabulario."""

    return [
        token
        for token in normalizar_texto(texto).split()
        if len(token) >= 3 and token not in STOPWORDS_COBERTURA and not token.isdigit()
    ]

