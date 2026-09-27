import type { ChromaKeyConfig } from "../types";

interface ChromaKeyToggleProps {
  value: ChromaKeyConfig;
  onChange: (config: ChromaKeyConfig) => void;
}

export default function ChromaKeyToggle({
  value,
  onChange,
}: ChromaKeyToggleProps) {
  return (
    <fieldset className="w-full max-w-md">
      <legend className="mb-2 font-semibold text-slate-700">
        Quitar fondo (opcional)
      </legend>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={value.enabled}
          onChange={(event) =>
            onChange({ ...value, enabled: event.target.checked })
          }
        />
        Quitar fondo de color uniforme (chroma key)
      </label>

      <p className="mt-1 text-xs text-slate-500">
        Detecta el color de las esquinas de la imagen y lo vuelve transparente.
        Funciona mejor con logos sobre fondo sólido; no está pensado para fotos.
      </p>

      {value.enabled && (
        <div className="mt-3">
          <label
            htmlFor="chroma-tolerance"
            className="block text-xs text-slate-600"
          >
            Sensibilidad: {value.tolerance}
          </label>
          <input
            id="chroma-tolerance"
            type="range"
            min={0}
            max={100}
            value={value.tolerance}
            onChange={(event) =>
              onChange({ ...value, tolerance: Number(event.target.value) })
            }
            className="w-full"
          />
        </div>
      )}
    </fieldset>
  );
}
