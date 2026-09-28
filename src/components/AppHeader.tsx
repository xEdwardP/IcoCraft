import ThemeToggle from "./ThemeToggle";

function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <rect width="32" height="32" rx="8" className="fill-ink" />
      <rect x="6" y="6" width="9" height="9" rx="2" className="fill-accent" />
      <rect
        x="17"
        y="6"
        width="9"
        height="9"
        rx="2"
        className="fill-canvas"
        opacity=".9"
      />
      <rect
        x="6"
        y="17"
        width="9"
        height="9"
        rx="2"
        className="fill-canvas"
        opacity=".45"
      />
      <rect
        x="17"
        y="17"
        width="9"
        height="9"
        rx="2"
        className="fill-accent"
        opacity=".7"
      />
    </svg>
  );
}

export default function AppHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
      <div className="flex items-center gap-2.5">
        <LogoMark className="h-8 w-8" />
        <span className="text-lg font-semibold tracking-tight">IcoCraft</span>
      </div>
      <ThemeToggle />
    </header>
  );
}
