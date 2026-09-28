import { useEffect, useMemo } from "react";
import type { GeneratedIcon } from "../types";

interface PreviewGridProps {
  icons: GeneratedIcon[];
}

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
    <div>
      <p className="mb-4 text-sm text-muted">
        Cada icono se muestra en su tamaño real, en píxeles.
      </p>
      <ul className="flex flex-wrap items-end gap-x-5 gap-y-6">
        {icons.map((icon, index) => (
          <li key={icon.size} className="flex flex-col items-center gap-2">
            <div className="checker rounded-md border border-line p-1">
              <img
                src={objectUrls[index]}
                alt={`Icono de ${icon.size} por ${icon.size} píxeles`}
                width={icon.size}
                height={icon.size}
                className="block h-auto max-w-full [image-rendering:pixelated]"
              />
            </div>
            <span className="text-xs tabular-nums text-muted">
              {icon.size} px
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
