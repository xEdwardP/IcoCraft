import { useState } from "react";
import { triggerDownload } from "../lib/download";
import { removeBackgroundOriginalSize } from "../lib/imageResizer";
import Button from "./ui/Button";
import { DownloadIcon } from "./ui/icons";

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
      setError("No se pudo generar la imagen sin fondo. Intenta de nuevo.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <Button
        onClick={() => void handleDownload()}
        disabled={!file || isProcessing}
      >
        <DownloadIcon className="h-4 w-4" />
        {isProcessing ? "Procesando..." : "Descargar imagen sin fondo"}
      </Button>
      <p className="mt-1.5 text-xs text-muted">
        PNG con el tamaño original, solo con el fondo transparente.
      </p>
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
