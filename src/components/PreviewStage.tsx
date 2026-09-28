import type { ReactNode } from "react";
import type { GeneratedIcon } from "../types";
import PreviewGrid from "./PreviewGrid";
import ProgressBar from "./ProgressBar";
import Notice from "./ui/Notice";

interface PreviewStageProps {
  sourceUrl: string | null;
  icons: GeneratedIcon[];
  isGenerating: boolean;
  progress: { current: number; total: number };
  isStale: boolean;
  actions?: ReactNode;
  className?: string;
}

const PLACEHOLDER_SIZES = [16, 24, 32, 48, 64, 96];

export default function PreviewStage({
  sourceUrl,
  icons,
  isGenerating,
  progress,
  isStale,
  actions,
  className = "",
}: PreviewStageProps) {
  const hasIcons = icons.length > 0;

  return (
    <section
      aria-label="Vista previa"
      className={`rounded-2xl border border-line bg-surface ${className}`}
    >
      <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
        <h2 className="text-base font-semibold">Vista previa</h2>
        {hasIcons && (
          <p className="text-sm text-muted">
            {icons.length === 1
              ? "1 tamaño listo"
              : `${icons.length} tamaños listos`}
          </p>
        )}
      </div>

      <div className="px-5 py-6 sm:px-6">
        {isGenerating ? (
          <div className="flex min-h-72 items-center justify-center">
            <ProgressBar current={progress.current} total={progress.total} />
          </div>
        ) : hasIcons ? (
          <div className="space-y-5">
            {isStale && (
              <Notice variant="warning">
                Cambiaste las opciones. Genera los iconos de nuevo para que la
                descarga las incluya.
              </Notice>
            )}
            <PreviewGrid icons={icons} />
          </div>
        ) : sourceUrl ? (
          <figure>
            <div className="checker flex min-h-72 items-center justify-center overflow-hidden rounded-xl border border-line p-4">
              <img
                src={sourceUrl}
                alt="Imagen original cargada"
                className="max-h-96 max-w-full object-contain"
              />
            </div>
            <figcaption className="mt-3 text-sm text-muted">
              Imagen original. Elige las opciones y genera tus iconos.
            </figcaption>
          </figure>
        ) : (
          <div className="flex min-h-72 flex-col items-center justify-center gap-6 text-center">
            <div aria-hidden="true" className="flex items-end gap-3">
              {PLACEHOLDER_SIZES.map((size) => (
                <div
                  key={size}
                  style={{ width: size, height: size }}
                  className="rounded-sm border border-dashed border-line"
                />
              ))}
            </div>
            <div>
              <p className="text-sm font-medium">Aquí verás tus iconos</p>
              <p className="mt-1 text-sm text-muted">
                Sube una imagen para empezar.
              </p>
            </div>
          </div>
        )}
      </div>

      {hasIcons && !isGenerating && actions && (
        <div className="flex flex-wrap items-start gap-3 border-t border-line px-5 py-4 sm:px-6">
          {actions}
        </div>
      )}
    </section>
  );
}
