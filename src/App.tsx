import { useState } from "react";
import BackgroundPicker from "./components/BackgroundPicker";
import ChromaKeyToggle from "./components/ChromaKeyToggle";
import DownloadButton from "./components/DownloadButton";
import FitModeSelector from "./components/FitModeSelector";
import ImageDropzone from "./components/ImageDropzone";
import PreviewGrid from "./components/PreviewGrid";
import ProgressBar from "./components/ProgressBar";
import RemoveBackgroundExport from "./components/RemoveBackgroundExport";
import SizeSelector from "./components/SizeSelector";
import { DEFAULT_CHROMA_KEY_TOLERANCE, DEFAULT_SIZES } from "./lib/constants";
import { getBaseFileName } from "./lib/filenames";
import { generateIcons } from "./lib/imageResizer";
import type {
  BackgroundConfig,
  ChromaKeyConfig,
  FitMode,
  GeneratedIcon,
  IconSize,
} from "./types";

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sizes, setSizes] = useState<IconSize[]>(DEFAULT_SIZES);
  const [fitMode, setFitMode] = useState<FitMode>("fit");
  const [background, setBackground] = useState<BackgroundConfig>({
    mode: "transparent",
    color: "#4f46e5",
  });
  const [chromaKey, setChromaKey] = useState<ChromaKeyConfig>({
    enabled: false,
    tolerance: DEFAULT_CHROMA_KEY_TOLERANCE,
  });
  const [icons, setIcons] = useState<GeneratedIcon[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const canGenerate =
    selectedFile !== null && sizes.length > 0 && !isGenerating;

  const fileNameBase = selectedFile
    ? getBaseFileName(selectedFile.name)
    : "icocraft";

  const handleImageAccepted = (file: File) => {
    setSelectedFile(file);
    setIcons([]);
  };

  const handleGenerate = async () => {
    if (!selectedFile) return;

    setIsGenerating(true);
    setGenerationError(null);
    setIcons([]);
    setProgress({ current: 0, total: sizes.length });

    try {
      const result = await generateIcons(
        selectedFile,
        { sizes, fitMode, background, chromaKey },
        (current, total) => setProgress({ current, total }),
      );
      setIcons(result);
    } catch {
      setGenerationError(
        "Ocurrió un error generando los iconos. Intenta de nuevo.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 p-6">
      <h1 className="text-3xl font-bold text-brand">IcoCraft</h1>
      <p className="text-slate-600">
        Sube una imagen para generar tus iconos .ico
      </p>

      <ImageDropzone onImageAccepted={handleImageAccepted} />

      {selectedFile && (
        <p className="text-sm text-slate-500">
          Imagen cargada: {selectedFile.name}
        </p>
      )}

      <SizeSelector selectedSizes={sizes} onChange={setSizes} />
      <FitModeSelector value={fitMode} onChange={setFitMode} />
      <BackgroundPicker value={background} onChange={setBackground} />
      <ChromaKeyToggle value={chromaKey} onChange={setChromaKey} />
      <RemoveBackgroundExport
        file={selectedFile}
        tolerance={chromaKey.tolerance}
        enabled={chromaKey.enabled}
        fileNameBase={fileNameBase}
      />

      <button
        type="button"
        disabled={!canGenerate}
        onClick={() => void handleGenerate()}
        className="rounded bg-brand px-6 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Generar iconos
      </button>

      {isGenerating && (
        <ProgressBar current={progress.current} total={progress.total} />
      )}
      {generationError && (
        <p className="text-sm text-red-600">{generationError}</p>
      )}

      <PreviewGrid icons={icons} />
      {icons.length > 0 && (
        <DownloadButton icons={icons} fileNameBase={fileNameBase} />
      )}
    </main>
  );
}
