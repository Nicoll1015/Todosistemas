#!/usr/bin/env python3
"""
Convierte un logo claro sobre fondo sólido en un WebP con fondo transparente.

Pensado para los logos de clientes: vienen como captura con fondo navy y el
logo en blanco. Se calcula el canal alfa deshaciendo la mezcla:

    pixel = alfa * blanco + (1 - alfa) * fondo
    alfa  = (pixel - fondo) / (255 - fondo)

Así se conserva el antialias de los bordes en vez de recortar con un umbral,
que dejaría los contornos dentados.

Uso:
    python tools/logo-to-web.py <origen> <nombre-salida> [alto-px]

Ejemplo:
    python tools/logo-to-web.py "C:/ruta/fogafin.png" fogafin 160
"""

import sys
from pathlib import Path

import numpy as np
from PIL import Image

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "assets" / "img" / "clientes"
DEFAULT_HEIGHT = 160


def detect_background(arr: np.ndarray) -> np.ndarray:
    """Toma el color de las cuatro esquinas; el más repetido es el fondo."""
    corners = [arr[0, 0], arr[0, -1], arr[-1, 0], arr[-1, -1]]
    return np.median(np.stack(corners), axis=0)


def unmix(path: Path, stem: str, height: int) -> None:
    image = Image.open(path).convert("RGB")
    arr = np.array(image).astype(float)

    bg = detect_background(arr)
    denom = np.maximum(255.0 - bg, 1.0)

    # Alfa por canal; el máximo evita perder trazos que solo destacan en uno.
    alpha = np.max((arr - bg) / denom, axis=2)
    alpha = np.clip(alpha, 0.0, 1.0)

    rgba = np.dstack([
        np.full(arr.shape[:2], 255, dtype=np.uint8),
        np.full(arr.shape[:2], 255, dtype=np.uint8),
        np.full(arr.shape[:2], 255, dtype=np.uint8),
        (alpha * 255).astype(np.uint8),
    ])

    result = Image.fromarray(rgba, "RGBA")

    # Recorte al contenido real, con un margen mínimo.
    bbox = result.getbbox()
    if bbox:
        result = result.crop(bbox)

    if result.height > height:
        width = round(result.width * height / result.height)
        result = result.resize((width, height), Image.LANCZOS)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    out = OUTPUT_DIR / f"{stem}.webp"
    result.save(out, "WEBP", quality=92, method=6)

    kb = out.stat().st_size / 1024
    print(f"  {out.name:<20} {result.width}x{result.height:<5} {kb:6.1f} KB  (fondo {bg.astype(int)})")


def main() -> int:
    if len(sys.argv) < 3:
        print(__doc__)
        return 1

    source = Path(sys.argv[1])
    if not source.is_file():
        print(f"No existe el archivo: {source}")
        return 1

    height = int(sys.argv[3]) if len(sys.argv) > 3 else DEFAULT_HEIGHT
    unmix(source, sys.argv[2], height)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
