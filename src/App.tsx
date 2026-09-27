import { useState } from "react";
import BackgroundPicker from "./components/BackgroundPicker";
import FitModeSelector from "./components/FitModeSelector";
import ImageDropzone from "./components/ImageDropzone";
import SizeSelector from "./components/SizeSelector";
import { DEFAULT_SIZES } from "./lib/constants";
import type { BackgroundConfig, FitMode, IconSize } from "./types";

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sizes, setSizes] = useState<IconSize[]>(DEFAULT_SIZES);
  const [fitMode, setFitMode] = useState<FitMode>("fit");
  const [background, setBackground] = useState<BackgroundConfig>({
    mode: "transparent",
    color: "#4f46e5",
  });

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 p-6">
      <h1 className="text-3xl font-bold text-brand">IcoCraft</h1>
      <p className="text-slate-600">
        Sube una imagen para generar tus iconos .ico
      </p>

      <ImageDropzone onImageAccepted={setSelectedFile} />

      {selectedFile && (
        <p className="text-sm text-slate-500">
          Imagen cargada: {selectedFile.name}
        </p>
      )}

      <SizeSelector selectedSizes={sizes} onChange={setSizes} />
      <FitModeSelector value={fitMode} onChange={setFitMode} />
      <BackgroundPicker value={background} onChange={setBackground} />
    </main>
  );
}