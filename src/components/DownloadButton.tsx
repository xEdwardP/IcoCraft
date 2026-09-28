import { useState } from "react";
import { triggerDownload } from "../lib/download";
import { encodeIco } from "../lib/icoEncoder";
import type { GeneratedIcon } from "../types";

interface DownloadButtonProps {
  icons: GeneratedIcon[];
  fileNameBase: string;
}

export default function DownloadButton({
  icons,
  fileNameBase,
}: DownloadButtonProps) {
  const [error, setError] = useState<string | null>(null);

  const handleDownload = () => {
    try {
      const icoBytes = encodeIco(icons);
      triggerDownload(icoBytes, `${fileNameBase}.ico`, "image/x-icon");
    } catch {
      setError("No se pudo generar el archivo .ico.");
    }
  };

  return (
    <div className="w-full max-w-md">
      <button
        type="button"
        onClick={handleDownload}
        disabled={icons.length === 0}
        className="w-full rounded bg-brand px-6 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Descargar .ico
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
