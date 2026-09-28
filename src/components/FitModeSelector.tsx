import type { FitMode } from "../types";

interface FitModeSelectorProps {
  value: FitMode;
  onChange: (mode: FitMode) => void;
}

const OPTIONS: { value: FitMode; label: string; description: string }[] = [
  {
    value: "fit",
    label: "Ajustar",
    description: "Muestra toda la imagen y deja libres los bordes.",
  },
  {
    value: "crop",
    label: "Recortar",
    description: "Llena el cuadrado y recorta lo que sobre.",
  },
];

function FitDiagram({ mode }: { mode: FitMode }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className="h-10 w-10">
      <rect
        x="1"
        y="1"
        width="38"
        height="38"
        rx="6"
        className="fill-sunken stroke-line"
      />
      {mode === "fit" ? (
        <rect
          x="6"
          y="12"
          width="28"
          height="16"
          rx="2"
          className="fill-accent"
        />
      ) : (
        <rect
          x="6"
          y="6"
          width="28"
          height="28"
          rx="2"
          className="fill-accent"
        />
      )}
    </svg>
  );
}

export default function FitModeSelector({
  value,
  onChange,
}: FitModeSelectorProps) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium">
        Si la imagen no es cuadrada
      </legend>
      <div className="grid grid-cols-2 gap-3">
        {OPTIONS.map((option) => (
          <label key={option.value} className="relative block">
            <input
              type="radio"
              name="fit-mode"
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <span className="flex h-full cursor-pointer flex-col gap-2 rounded-xl border border-line bg-surface p-3 transition-colors hover:border-ink/40 peer-checked:border-ink peer-checked:ring-1 peer-checked:ring-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink">
              <FitDiagram mode={option.value} />
              <span className="text-sm font-medium">{option.label}</span>
              <span className="text-xs text-muted">{option.description}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
