import { useEffect, useMemo } from "react";
import type { GeneratedIcon } from "../types";

interface PreviewGridProps {
  icons: GeneratedIcon[];
}

const CHECKERBOARD_STYLE = {
  backgroundImage: "repeating-conic-gradient(#e5e7eb 0% 25%, #ffffff 0% 50%)",
  backgroundSize: "16px 16px",
};

export default function PreviewGrid({ icons }: PreviewGridProps) {
  const objectUrls = useMemo(
    () =>
      icons.map((icon) =>
        URL.createObjectURL(
          new Blob([icon.pngData.slice()], { type: "image/png" }),
        ),
      ),
    [icons],
  );

  useEffect(() => {
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [objectUrls]);

  if (icons.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-md">
      <h2 className="mb-2 font-semibold text-slate-700">Vista previa</h2>
      <div className="flex flex-wrap gap-4">
        {icons.map((icon, index) => (
          <div key={icon.size} className="flex flex-col items-center gap-1">
            <div
              className="flex h-16 w-16 items-center justify-center rounded border border-slate-200"
              style={CHECKERBOARD_STYLE}
            >
              <img
                src={objectUrls[index]}
                alt={`Icono de ${icon.size}px`}
                className="max-h-full max-w-full"
              />
            </div>
            <span className="text-xs text-slate-500">{icon.size}px</span>
          </div>
        ))}
      </div>
    </div>
  );
}
