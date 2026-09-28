import type { ReactNode } from "react";
import { AlertIcon } from "./icons";

type NoticeVariant = "error" | "warning";

const STYLES: Record<NoticeVariant, string> = {
  error: "border-danger/40 bg-danger/10 text-danger",
  warning: "border-warning/40 bg-warning/10 text-warning",
};

interface NoticeProps {
  variant: NoticeVariant;
  children: ReactNode;
}

export default function Notice({ variant, children }: NoticeProps) {
  return (
    <p
      role={variant === "error" ? "alert" : "status"}
      className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${STYLES[variant]}`}
    >
      <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}
