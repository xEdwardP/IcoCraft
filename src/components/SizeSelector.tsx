import { useState } from "react";
import {
  AVAILABLE_SIZES,
  DEFAULT_SIZES,
  MAX_ICON_DIMENSION,
} from "../lib/constants";
import type { IconSize } from "../types";

interface SizeSelectorProps {
  selectedSizes: IconSize[];
  onChange: (sizes: IconSize[]) => void;
}

export default function SizeSelector({
  selectedSizes,
  onChange,
}: SizeSelectorProps) {
  const [customSize, setCustomSize] = useState("");
  const [customError, setCustomError] = useState<string | null>(null);

  const toggleSize = (size: IconSize) => {
    if (selectedSizes.includes(size)) {
      onChange(selectedSizes.filter((current) => current !== size));
    } else {
      onChange([...selectedSizes, size].sort((a, b) => a - b));
    }
  };

  const addCustomSize = () => {
    const parsed = Number(customSize);

    if (
      !Number.isInteger(parsed) ||
      parsed < 1 ||
      parsed > MAX_ICON_DIMENSION
    ) {
      setCustomError(
        `Ingresa un número entero entre 1 y ${MAX_ICON_DIMENSION}.`,
      );
      return;
    }

    if (selectedSizes.includes(parsed)) {
      setCustomError("Ese tamaño ya está seleccionado.");
      return;
    }

    onChange([...selectedSizes, parsed].sort((a, b) => a - b));
    setCustomSize("");
    setCustomError(null);
  };

  return (
    <fieldset className="w-full max-w-md">
      <legend className="mb-2 font-semibold text-slate-700">
        Tamaños de icono
      </legend>

      <div className="mb-3 flex gap-2 text-xs">
        <button
          type="button"
          onClick={() => onChange([...DEFAULT_SIZES])}
          className="rounded bg-slate-100 px-2 py-1 hover:bg-slate-200"
        >
          Recomendados
        </button>
        <button
          type="button"
          onClick={() => onChange([...AVAILABLE_SIZES])}
          className="rounded bg-slate-100 px-2 py-1 hover:bg-slate-200"
        >
          Todos
        </button>
        <button
          type="button"
          onClick={() => onChange([])}
          className="rounded bg-slate-100 px-2 py-1 hover:bg-slate-200"
        >
          Ninguno
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {AVAILABLE_SIZES.map((size) => (
          <label key={size} className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={selectedSizes.includes(size)}
              onChange={() => toggleSize(size)}
            />
            {size}px
          </label>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          type="number"
          min={1}
          max={MAX_ICON_DIMENSION}
          value={customSize}
          onChange={(event) => setCustomSize(event.target.value)}
          placeholder="Tamaño personalizado"
          className="w-40 rounded border border-slate-300 px-2 py-1 text-sm"
        />
        <button
          type="button"
          onClick={addCustomSize}
          className="rounded bg-brand px-3 py-1 text-sm text-white"
        >
          Agregar
        </button>
      </div>
      {customError && (
        <p className="mt-1 text-xs text-red-600">{customError}</p>
      )}

      {selectedSizes.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedSizes.map((size) => (
            <span
              key={size}
              className="flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-700"
            >
              {size}px
              <button
                type="button"
                onClick={() => toggleSize(size)}
                aria-label={`Quitar tamaño ${size}px`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {selectedSizes.length === 0 && (
        <p className="mt-2 text-xs text-amber-600">
          Selecciona al menos un tamaño.
        </p>
      )}
    </fieldset>
  );
}
