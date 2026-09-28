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
    <fieldset>
      <legend className="sr-only">Quitar fondo</legend>

      <label className="flex cursor-pointer items-start gap-3">
        <span className="relative mt-0.5 inline-flex h-6 w-11 shrink-0">
          <input
            type="checkbox"
            role="switch"
            checked={value.enabled}
            onChange={(event) =>
              onChange({ ...value, enabled: event.target.checked })
            }
            className="peer sr-only"
          />
          <span className="absolute inset-0 rounded-full bg-line transition-colors peer-checked:bg-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink" />
          <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
        </span>
        <span>
          <span className="block text-sm font-medium">
            Quitar el fondo de color uniforme
          </span>
          <span className="block text-xs text-muted">
            Vuelve transparente el color de las esquinas. Funciona bien con
            logos sobre fondo liso; con fotos no da buen resultado.
          </span>
        </span>
      </label>

      {value.enabled && (
        <div className="mt-4 pl-14">
          <div className="mb-1 flex items-center justify-between text-sm">
            <label htmlFor="chroma-tolerance" className="font-medium">
              Sensibilidad
            </label>
            <span className="tabular-nums text-muted">{value.tolerance}</span>
          </div>
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
          <p className="mt-1 text-xs text-muted">
            Más alta quita más tonos parecidos al fondo.
          </p>
        </div>
      )}
    </fieldset>
  );
}