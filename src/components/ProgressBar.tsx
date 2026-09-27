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
    <div className="w-full max-w-md" role="status" aria-live="polite">
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-brand transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Generando iconos... {current}/{total}
      </p>
    </div>
  );
}
