import type { ReactNode } from "react";

interface StepProps {
  number: number;
  title: string;
  description?: string;
  children: ReactNode;
}

export default function Step({
  number,
  title,
  description,
  children,
}: StepProps) {
  return (
    <section className="px-5 py-6 sm:px-6">
      <div className="mb-5 flex items-start gap-3">
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-semibold text-canvas"
        >
          {number}
        </span>
        <div>
          <h2 className="text-base font-semibold leading-6">{title}</h2>
          {description && (
            <p className="mt-0.5 text-sm text-muted">{description}</p>
          )}
        </div>
      </div>
      <div className="space-y-6 sm:pl-9">{children}</div>
    </section>
  );
}
