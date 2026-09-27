import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import { ACCEPTED_MIME_TYPES, MAX_FILE_SIZE_MB } from "../lib/constants";
import { validateImageFile } from "../lib/validators";

interface ImageDropzoneProps {
  /** Called only when the file passes validation. */
  onImageAccepted: (file: File) => void;
}

export default function ImageDropzone({ onImageAccepted }: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Revoke the previous preview URL whenever it changes or the component unmounts,
  // so we don't leak object URLs as the user tries different images.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const processFile = useCallback(
    async (file: File) => {
      const result = await validateImageFile(file);
      setErrors(result.errors);
      setWarnings(result.warnings);

      if (!result.valid) {
        setPreviewUrl(null);
        return;
      }

      setPreviewUrl(URL.createObjectURL(file));
      onImageAccepted(file);
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
      if (file) void processFile(file);
    },
    [processFile],
  );

  const openFilePicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openFilePicker();
      }
    },
    [openFilePicker],
  );

  return (
    <div className="w-full max-w-md">
      <div
        role="button"
        tabIndex={0}
        aria-label="Cargar imagen: arrastra un archivo o presiona para seleccionarlo"
        onClick={openFilePicker}
        onKeyDown={handleKeyDown}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-brand ${
          isDragging ? "border-brand bg-indigo-50" : "border-slate-300 bg-white"
        }`}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Vista previa de la imagen cargada"
            className="mb-4 h-32 w-32 rounded object-contain"
          />
        ) : (
          <p className="mb-2 text-slate-500">
            Arrastra una imagen aquí o haz clic para seleccionarla
          </p>
        )}
        <p className="text-xs text-slate-400">
          PNG, JPG o WebP — máximo {MAX_FILE_SIZE_MB} MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_MIME_TYPES.join(",")}
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {errors.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm text-red-600">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      {warnings.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm text-amber-600">
          {warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
