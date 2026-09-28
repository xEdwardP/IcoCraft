interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  if (total === 0) {
    return null;
  }

  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full max-w-xs">
      <div
        role="progressbar"
        aria-label="Progreso de generación"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
        className="h-2 w-full overflow-hidden rounded-full bg-line"
      >
        <div
          className="h-full rounded-full bg-accent transition-[width]"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-2 text-center text-sm text-muted" aria-live="polite">
        Generando iconos: {current} de {total}
      </p>
    </div>
  );
}
