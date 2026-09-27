import { useState } from "react";
import ImageDropzone from "./components/ImageDropzone";

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 p-6">
      <h1 className="text-3xl font-bold text-brand">IcoCraft</h1>
      <p className="text-slate-600">
        Sube una imagen para generar tus iconos .ico
      </p>

      <ImageDropzone onImageAccepted={setSelectedFile} />

      {selectedFile && (
        <p className="text-sm text-slate-500">
          Imagen cargada: {selectedFile.name}
        </p>
      )}
    </main>
  );
}
