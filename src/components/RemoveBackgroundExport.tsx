import { useState } from "react";
import { triggerDownload } from "../lib/download";
import { removeBackgroundOriginalSize } from "../lib/imageResizer";

interface RemoveBackgroundExportProps {
  file: File | null;
  tolerance: number;
  enabled: boolean;
  fileNameBase: string;
}

export default function RemoveBackgroundExport({
  file,
  tolerance,
  enabled,
  fileNameBase,
}: RemoveBackgroundExportProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!enabled) {
    return null;
  }

  const handleDownload = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const pngBytes = await removeBackgroundOriginalSize(file, tolerance);
      triggerDownload(pngBytes, `${fileNameBase}-sin-fondo.png`, "image/png");
    } catch {
      setError("No se pudo generar la imagen sin fondo.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <button
        type="button"
        onClick={() => void handleDownload()}
        disabled={!file || isProcessing}
        className="w-full rounded border border-brand px-4 py-2 text-sm font-medium text-brand disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isProcessing
          ? "Procesando..."
          : "Descargar imagen sin fondo (tamaño original)"}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
