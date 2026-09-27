import type { FitMode } from "../types";

interface FitModeSelectorProps {
  value: FitMode;
  onChange: (mode: FitMode) => void;
}

const OPTIONS: { value: FitMode; label: string; description: string }[] = [
  {
    value: "fit",
    label: "Ajustar",
    description:
      "Mantiene toda la imagen visible, rellenando los bordes si no es cuadrada.",
  },
  {
    value: "crop",
    label: "Recortar",
    description:
      "Llena todo el cuadrado, recortando los bordes de la imagen si no es cuadrada.",
  },
];

export default function FitModeSelector({
  value,
  onChange,
}: FitModeSelectorProps) {
  return (
    <fieldset className="w-full max-w-md">
      <legend className="mb-2 font-semibold text-slate-700">
        Modo de ajuste
      </legend>
      <div className="flex gap-4">
        {OPTIONS.map((option) => (
          <label
            key={option.value}
            className="flex-1 cursor-pointer rounded-lg border border-slate-300 p-3 text-sm has-[:checked]:border-brand has-[:checked]:bg-indigo-50"
          >
            <input
              type="radio"
              name="fit-mode"
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="mr-2"
            />
            <span className="font-medium">{option.label}</span>
            <p className="mt-1 text-xs text-slate-500">{option.description}</p>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
