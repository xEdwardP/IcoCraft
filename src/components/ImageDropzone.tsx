import {
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { ACCEPTED_MIME_TYPES, MAX_FILE_SIZE_MB } from "../lib/constants";
import { validateImageFile } from "../lib/validators";
import { UploadIcon } from "./ui/icons";
import Notice from "./ui/Notice";

interface LoadedImage {
  name: string;
  url: string;
}

interface ImageDropzoneProps {
  onImageAccepted: (file: File) => void;
  loaded: LoadedImage | null;
}

export default function ImageDropzone({
  onImageAccepted,
  loaded,
}: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      const result = await validateImageFile(file);
      setErrors(result.errors);
      setWarnings(result.warnings);

      if (result.valid) {
        onImageAccepted(file);
      }
    },
    [onImageAccepted],
  );

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer.files[0];
      if (file) void processFile(file);
    },
    [processFile],
  );

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (file) void processFile(file);
    },
    [processFile],
  );

  return (
    <div>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          if (
            !event.currentTarget.contains(event.relatedTarget as Node | null)
          ) {
            setIsDragging(false);
          }
        }}
        onDrop={handleDrop}
        className={`rounded-xl border-2 border-dashed transition-colors ${
          isDragging
            ? "border-accent bg-accent/10"
            : "border-line bg-sunken hover:border-ink/40"
        }`}
      >
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full cursor-pointer items-center gap-4 rounded-[inherit] p-4 text-left"
        >
          {loaded ? (
            <>
              <span className="checker flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-line">
                <img
                  src={loaded.url}
                  alt=""
                  className="max-h-full max-w-full object-contain"
                />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">
                  {loaded.name}
                </span>
                <span className="block text-xs text-muted">
                  Haz clic o arrastra otra imagen para cambiarla
                </span>
              </span>
            </>
          ) : (
            <span className="flex w-full flex-col items-center gap-1.5 py-6 text-center">
              <UploadIcon className="mb-1 h-7 w-7 text-muted" />
              <span className="text-sm font-medium">
                Arrastra una imagen aquí
              </span>
              <span className="text-sm text-muted">
                o haz clic para elegir un archivo
              </span>
              <span className="mt-1 text-xs text-muted">
                PNG, JPG o WebP, hasta {MAX_FILE_SIZE_MB} MB
              </span>
            </span>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_MIME_TYPES.join(",")}
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {(errors.length > 0 || warnings.length > 0) && (
        <div className="mt-3 space-y-2">
          {errors.map((error) => (
            <Notice key={error} variant="error">
              {error}
            </Notice>
          ))}
          {warnings.map((warning) => (
            <Notice key={warning} variant="warning">
              {warning}
            </Notice>
          ))}
        </div>
      )}
    </div>
  );
}
