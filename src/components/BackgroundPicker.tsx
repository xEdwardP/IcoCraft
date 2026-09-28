import type { BackgroundConfig, BackgroundMode } from "../types";

interface BackgroundPickerProps {
  value: BackgroundConfig;
  onChange: (config: BackgroundConfig) => void;
}

const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;

const PRESET_COLORS = [
  "#ffffff",
  "#000000",
  "#ff6a1f",
  "#2f5bff",
  "#16a34a",
  "#e11d48",
  "#f5b301",
  "#7c3aed",
];

const MODES: { value: BackgroundMode; label: string }[] = [
  { value: "transparent", label: "Transparente" },
  { value: "solid", label: "Color sólido" },
];

export default function BackgroundPicker({
  value,
  onChange,
}: BackgroundPickerProps) {
  const setMode = (mode: BackgroundMode) => onChange({ ...value, mode });
  const setColor = (color: string) => onChange({ ...value, color });

  const isValidHex = HEX_COLOR_REGEX.test(value.color);

  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium">Fondo del icono</legend>

      <div className="inline-flex rounded-lg border border-line bg-sunken p-1">
        {MODES.map((mode) => (
          <label key={mode.value} className="relative">
            <input
              type="radio"
              name="background-mode"
              checked={value.mode === mode.value}
              onChange={() => setMode(mode.value)}
              className="peer sr-only"
            />
            <span className="block cursor-pointer select-none rounded-md px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:text-ink peer-checked:bg-surface peer-checked:text-ink peer-checked:shadow-sm peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink">
              {mode.label}
            </span>
          </label>
        ))}
      </div>

      {value.mode === "solid" && (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map((hex) => (
              <button
                key={hex}
                type="button"
                aria-label={`Usar el color ${hex}`}
                aria-pressed={value.color.toLowerCase() === hex}
                onClick={() => setColor(hex)}
                style={{ backgroundColor: hex }}
                className="h-7 w-7 rounded-full border border-line ring-offset-2 ring-offset-surface aria-pressed:ring-2 aria-pressed:ring-ink"
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="color"
              value={
                isValidHex && value.color.length === 7 ? value.color : "#ffffff"
              }
              onChange={(event) => setColor(event.target.value)}
              className="h-10 w-12 cursor-pointer rounded-lg border border-line bg-surface p-1"
              aria-label="Selector de color de fondo"
            />
            <input
              type="text"
              value={value.color}
              onChange={(event) => setColor(event.target.value)}
              placeholder="#ffffff"
              maxLength={7}
              spellCheck={false}
              aria-label="Color de fondo en hexadecimal"
              aria-invalid={!isValidHex}
              className="w-28 rounded-lg border border-line bg-surface px-3 py-2 text-sm uppercase placeholder:normal-case placeholder:text-muted aria-[invalid=true]:border-danger"
            />
          </div>
          {!isValidHex && (
            <p role="alert" className="text-xs text-danger">
              Usa un color hexadecimal válido, por ejemplo #4f46e5.
            </p>
          )}
        </div>
      )}
    </fieldset>
  );
}
