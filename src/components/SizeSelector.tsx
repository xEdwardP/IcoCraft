import { useState, type FormEvent } from "react";
import {
  AVAILABLE_SIZES,
  DEFAULT_SIZES,
  MAX_ICON_DIMENSION,
} from "../lib/constants";
import type { IconSize } from "../types";
import Button from "./ui/Button";
import Notice from "./ui/Notice";

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

  const visibleSizes = Array.from(
    new Set([...AVAILABLE_SIZES, ...selectedSizes]),
  ).sort((a, b) => a - b);

  const toggleSize = (size: IconSize) => {
    if (selectedSizes.includes(size)) {
      onChange(selectedSizes.filter((current) => current !== size));
    } else {
      onChange([...selectedSizes, size].sort((a, b) => a - b));
    }
  };

  const addCustomSize = (event: FormEvent) => {
    event.preventDefault();
    const parsed = Number(customSize);

    if (
      !Number.isInteger(parsed) ||
      parsed < 1 ||
      parsed > MAX_ICON_DIMENSION
    ) {
      setCustomError(
        `Escribe un número entero entre 1 y ${MAX_ICON_DIMENSION}.`,
      );
      return;
    }

    if (!selectedSizes.includes(parsed)) {
      onChange([...selectedSizes, parsed].sort((a, b) => a - b));
    }
    setCustomSize("");
    setCustomError(null);
  };

  return (
    <fieldset>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <legend className="whitespace-nowrap text-sm font-medium">
          Tamaños
        </legend>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            className="px-2 py-1 text-xs"
            onClick={() => onChange([...DEFAULT_SIZES])}
          >
            Recomendados
          </Button>
          <Button
            variant="ghost"
            className="px-2 py-1 text-xs"
            onClick={() => onChange([...AVAILABLE_SIZES])}
          >
            Todos
          </Button>
          <Button
            variant="ghost"
            className="px-2 py-1 text-xs"
            onClick={() => onChange([])}
          >
            Ninguno
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {visibleSizes.map((size) => (
          <label key={size} className="relative">
            <input
              type="checkbox"
              checked={selectedSizes.includes(size)}
              onChange={() => toggleSize(size)}
              className="peer sr-only"
            />
            <span className="inline-flex min-w-16 cursor-pointer select-none items-center justify-center rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:border-ink/40 hover:text-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-canvas peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink">
              {size} px
            </span>
          </label>
        ))}
      </div>

      <form onSubmit={addCustomSize} className="mt-3 flex items-center gap-2">
        <label htmlFor="custom-size" className="sr-only">
          Tamaño personalizado en píxeles
        </label>
        <input
          id="custom-size"
          type="number"
          inputMode="numeric"
          min={1}
          max={MAX_ICON_DIMENSION}
          value={customSize}
          onChange={(event) => setCustomSize(event.target.value)}
          placeholder="Otro tamaño"
          aria-invalid={customError !== null}
          className="w-44 rounded-lg border border-line bg-surface px-3 py-2 text-sm placeholder:text-muted"
        />
        <Button type="submit" className="py-2">
          Agregar
        </Button>
      </form>
      {customError && (
        <p role="alert" className="mt-2 text-xs text-danger">
          {customError}
        </p>
      )}

      <div className="mt-3">
        {selectedSizes.length === 0 ? (
          <Notice variant="warning">Selecciona al menos un tamaño.</Notice>
        ) : (
          <p className="text-xs text-muted">
            {selectedSizes.length === 1
              ? "1 tamaño seleccionado"
              : `${selectedSizes.length} tamaños seleccionados`}
          </p>
        )}
      </div>
    </fieldset>
  );
}
