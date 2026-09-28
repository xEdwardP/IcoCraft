import { useEffect, useState } from "react";
import AppHeader from "./components/AppHeader";
import BackgroundPicker from "./components/BackgroundPicker";
import ChromaKeyToggle from "./components/ChromaKeyToggle";
import DownloadButton from "./components/DownloadButton";
import DownloadZipButton from "./components/DownloadZipButton";
import FitModeSelector from "./components/FitModeSelector";
import ImageDropzone from "./components/ImageDropzone";
import PreviewStage from "./components/PreviewStage";
import RemoveBackgroundExport from "./components/RemoveBackgroundExport";
import SizeSelector from "./components/SizeSelector";
import Button from "./components/ui/Button";
import Notice from "./components/ui/Notice";
import Step from "./components/ui/Step";
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

interface SourceImage {
  file: File;
  url: string;
}

export default function App() {
  const [source, setSource] = useState<SourceImage | null>(null);
  const [sizes, setSizes] = useState<IconSize[]>(DEFAULT_SIZES);
  const [fitMode, setFitMode] = useState<FitMode>("fit");
  const [background, setBackground] = useState<BackgroundConfig>({
    mode: "transparent",
    color: "#ffffff",
  });
  const [chromaKey, setChromaKey] = useState<ChromaKeyConfig>({
    enabled: false,
    tolerance: DEFAULT_CHROMA_KEY_TOLERANCE,
  });
  const [icons, setIcons] = useState<GeneratedIcon[]>([]);
  const [isStale, setIsStale] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  useEffect(() => {
    const url = source?.url;
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [source]);

  const selectedFile = source?.file ?? null;
  const canGenerate =
    selectedFile !== null && sizes.length > 0 && !isGenerating;
  const fileNameBase = selectedFile
    ? getBaseFileName(selectedFile.name)
    : "icocraft";

  const trackChange =
    <T,>(setter: (value: T) => void) =>
    (value: T) => {
      setter(value);
      setIsStale(true);
    };

  const handleImageAccepted = (file: File) => {
    setSource({ file, url: URL.createObjectURL(file) });
    setIcons([]);
    setIsStale(false);
    setGenerationError(null);
  };

  const handleGenerate = async () => {
    if (!selectedFile) return;

    setIsGenerating(true);
    setGenerationError(null);
    setIcons([]);
    setIsStale(false);
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
        "No se pudieron generar los iconos. Prueba con otra imagen o vuelve a intentarlo.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mb-8 max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Crea iconos .ico desde cualquier imagen
          </h1>
          <p className="mt-3 max-w-xl text-base text-muted">
            Sube una imagen, elige los tamaños y descarga el archivo. Todo pasa
            en tu navegador: tu imagen no se sube a ningún servidor.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] lg:items-start">
          <div className="divide-y divide-line rounded-2xl border border-line bg-surface">
            <Step number={1} title="Sube tu imagen">
              <ImageDropzone
                onImageAccepted={handleImageAccepted}
                loaded={
                  source ? { name: source.file.name, url: source.url } : null
                }
              />
            </Step>

            <Step
              number={2}
              title="Elige cómo se genera"
              description="Los valores por defecto sirven para la mayoría de los casos."
            >
              <SizeSelector
                selectedSizes={sizes}
                onChange={trackChange(setSizes)}
              />
              <FitModeSelector
                value={fitMode}
                onChange={trackChange(setFitMode)}
              />
              <BackgroundPicker
                value={background}
                onChange={trackChange(setBackground)}
              />
              <ChromaKeyToggle
                value={chromaKey}
                onChange={trackChange(setChromaKey)}
              />
              <RemoveBackgroundExport
                file={selectedFile}
                tolerance={chromaKey.tolerance}
                enabled={chromaKey.enabled}
                fileNameBase={fileNameBase}
              />
            </Step>

            <Step number={3} title="Genera tus iconos">
              <div className="space-y-3">
                <Button
                  variant={
                    icons.length > 0 && !isStale ? "secondary" : "primary"
                  }
                  fullWidth
                  disabled={!canGenerate}
                  onClick={() => void handleGenerate()}
                >
                  {isGenerating ? "Generando..." : "Generar iconos"}
                </Button>
                {!selectedFile && (
                  <p className="text-xs text-muted">
                    Sube una imagen para poder generar los iconos.
                  </p>
                )}
                {generationError && (
                  <Notice variant="error">{generationError}</Notice>
                )}
              </div>
            </Step>
          </div>

          <PreviewStage
            className="lg:sticky lg:top-6"
            sourceUrl={source?.url ?? null}
            icons={icons}
            isGenerating={isGenerating}
            progress={progress}
            isStale={isStale}
            actions={
              <>
                <DownloadButton icons={icons} fileNameBase={fileNameBase} />
                <DownloadZipButton icons={icons} fileNameBase={fileNameBase} />
              </>
            }
          />
        </div>
      </main>
    </div>
  );
}
