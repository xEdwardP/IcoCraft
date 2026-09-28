import { useState } from "react";
import { triggerDownload } from "../lib/download";
import { createIconsZip } from "../lib/zipExporter";
import type { GeneratedIcon } from "../types";
import Button from "./ui/Button";
import { DownloadIcon } from "./ui/icons";

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
    <div>
      <Button
        onClick={() => void handleDownload()}
        disabled={icons.length === 0 || isProcessing}
      >
        <DownloadIcon className="h-4 w-4" />
        {isProcessing ? "Generando .zip..." : "Descargar PNGs (.zip)"}
      </Button>
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
