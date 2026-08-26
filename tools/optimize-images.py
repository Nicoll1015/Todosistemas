#!/usr/bin/env python3
"""
Convierte imágenes a formatos web optimizados (AVIF + WebP) con variantes
responsive, para servirlas con <picture> o background-image.

Uso:
    python tools/optimize-images.py <archivo-origen> <nombre-salida> [ancho1 ancho2 ...]

Ejemplo:
    python tools/optimize-images.py "C:/ruta/fondo.png" hero-bg 1600 900

Genera en assets/img/:
    hero-bg-1600.avif  hero-bg-1600.webp
    hero-bg-900.avif   hero-bg-900.webp

Requiere: pip install pillow pillow-avif-plugin
"""

import sys
from pathlib import Path

from PIL import Image

try:
    import pillow_avif  # noqa: F401  (registra el codec AVIF en Pillow)

    AVIF_OK = True
except ImportError:
    AVIF_OK = False

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "assets" / "img"

# Calidades ajustadas para fondos/ilustraciones: AVIF rinde más por byte.
AVIF_QUALITY = 55
WEBP_QUALITY = 78


def optimize(source: Path, stem: str, widths: list[int]) -> None:
    image = Image.open(source)
    if image.mode not in ("RGB", "RGBA"):
        image = image.convert("RGB")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for width in widths:
        if width >= image.width:
            resized = image
        else:
            height = round(image.height * width / image.width)
            resized = image.resize((width, height), Image.LANCZOS)

        webp_path = OUTPUT_DIR / f"{stem}-{width}.webp"
        resized.save(webp_path, "WEBP", quality=WEBP_QUALITY, method=6)
        report(webp_path, resized.size)

        if AVIF_OK:
            avif_path = OUTPUT_DIR / f"{stem}-{width}.avif"
            resized.save(avif_path, "AVIF", quality=AVIF_QUALITY)
            report(avif_path, resized.size)


def report(path: Path, size: tuple[int, int]) -> None:
    kb = path.stat().st_size / 1024
    print(f"  {path.name:<28} {size[0]}x{size[1]:<6} {kb:7.1f} KB")


def main() -> int:
    if len(sys.argv) < 3:
        print(__doc__)
        return 1

    source = Path(sys.argv[1])
    if not source.is_file():
        print(f"No existe el archivo: {source}")
        return 1

    stem = sys.argv[2]
    widths = [int(w) for w in sys.argv[3:]] or [1600, 900]

    original_kb = source.stat().st_size / 1024
    print(f"Origen: {source.name} ({original_kb:.1f} KB)")
    optimize(source, stem, widths)

    if not AVIF_OK:
        print("\nAviso: falta pillow-avif-plugin, solo se generó WebP.")
        print("Instálalo con: pip install pillow-avif-plugin")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
