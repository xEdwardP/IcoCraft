import type { BackgroundConfig, BackgroundMode } from "../types";

interface BackgroundPickerProps {
  value: BackgroundConfig;
  onChange: (config: BackgroundConfig) => void;
}

const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;

export default function BackgroundPicker({
  value,
  onChange,
}: BackgroundPickerProps) {
  const setMode = (mode: BackgroundMode) => onChange({ ...value, mode });
  const setColor = (color: string) => onChange({ ...value, color });

  const isValidHex = HEX_COLOR_REGEX.test(value.color);

  return (
    <fieldset className="w-full max-w-md">
      <legend className="mb-2 font-semibold text-slate-700">
        Fondo del icono
      </legend>

      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="background-mode"
            checked={value.mode === "transparent"}
            onChange={() => setMode("transparent")}
          />
          Transparente
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="background-mode"
            checked={value.mode === "solid"}
            onChange={() => setMode("solid")}
          />
          Color sólido
        </label>
      </div>

      {value.mode === "solid" && (
        <div className="mt-3 flex items-center gap-2">
          <input
            type="color"
            value={isValidHex ? value.color : "#4f46e5"}
            onChange={(event) => setColor(event.target.value)}
            className="h-9 w-9 cursor-pointer rounded border border-slate-300"
            aria-label="Selector de color de fondo"
          />
          <input
            type="text"
            value={value.color}
            onChange={(event) => setColor(event.target.value)}
            placeholder="#4f46e5"
            className={`w-28 rounded border px-2 py-1 text-sm ${
              isValidHex ? "border-slate-300" : "border-red-400"
            }`}
            aria-label="Color de fondo en hexadecimal"
          />
          {!isValidHex && (
            <span className="text-xs text-red-600">Hex inválido</span>
          )}
        </div>
      )}
    </fieldset>
  );
}