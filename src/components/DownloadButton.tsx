import { useState } from "react";
import { triggerDownload } from "../lib/download";
import { encodeIco } from "../lib/icoEncoder";
import type { GeneratedIcon } from "../types";
import Button from "./ui/Button";
import { DownloadIcon } from "./ui/icons";

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
    setError(null);
    try {
      const icoBytes = encodeIco(icons);
      triggerDownload(icoBytes, `${fileNameBase}.ico`, "image/x-icon");
    } catch {
      setError("No se pudo generar el archivo .ico.");
    }
  };

  return (
    <div>
      <Button
        variant="primary"
        onClick={handleDownload}
        disabled={icons.length === 0}
      >
        <DownloadIcon className="h-4 w-4" />
        Descargar .ico
      </Button>
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
