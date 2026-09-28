import { useState } from "react";
import { triggerDownload } from "../lib/download";
import { createIconsZip } from "../lib/zipExporter";
import type { GeneratedIcon } from "../types";

interface DownloadZipButtonProps {
  icons: GeneratedIcon[];
  fileNameBase: string;
}

export default function DownloadZipButton({
  icons,
  fileNameBase,
}: DownloadZipButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const zipBytes = await createIconsZip(icons, fileNameBase);
      triggerDownload(zipBytes, `${fileNameBase}-pngs.zip`, "application/zip");
    } catch {
      setError("No se pudo generar el archivo .zip.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <button
        type="button"
        onClick={() => void handleDownload()}
        disabled={icons.length === 0 || isProcessing}
        className="w-full rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isProcessing ? "Generando .zip..." : "Descargar PNGs (.zip)"}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}