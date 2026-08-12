import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PencilBorder } from "../../../components/ui/PencilBorder";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { CrossIcon as X, CameraIcon as Camera, PhotoIcon as ImageIcon, UploadIcon as Upload } from "react-doodle-icons";

interface UploadPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityTitle: string;
  onUpload: (file: File, caption?: string) => Promise<void>;
  isUploading?: boolean;
}

export function UploadPhotoModal({
  isOpen,
  onClose,
  activityTitle,
  onUpload,
  isUploading = false,
}: UploadPhotoModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        setErrorMsg("File harus berupa gambar (JPEG, PNG, WEBP).");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg("Silakan ambil atau pilih foto terlebih dahulu.");
      return;
    }

    try {
      await onUpload(selectedFile, caption);
      setSelectedFile(null);
      setPreviewUrl(null);
      setCaption("");
      onClose();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Gagal mengunggah foto.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[var(--color-ink)]/40 backdrop-blur-xs"
          />

          {/* Hidden File Inputs */}
          {/* Camera Capture Input */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
          {/* File Picker Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.18 }}
            className="relative w-full max-w-md bg-[var(--color-cream)] p-6 md:p-8 rounded-[24px] shadow-[8px_10px_0px_0px_rgba(58,50,56,0.2)] z-10 max-h-[90vh] overflow-y-auto transform-gpu"
          >
            <PencilBorder color="var(--color-ink)" roughness={1.8} strokeWidth={2.5} seed={55} />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between mb-5 pb-3 border-b-2 border-[var(--color-ink)]/20">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[var(--color-blue)] rounded-xl border border-[var(--color-ink)] transform rotate-3">
                  <Camera className="w-5 h-5 text-[var(--color-ink)]" />
                </div>
                <div>
                  <h2 className="font-display text-2xl md:text-3xl text-[var(--color-ink)] leading-none">
                    Unggah Foto Kegiatan
                  </h2>
                  <p className="text-xs text-[var(--color-ink-soft)] font-medium mt-0.5 truncate max-w-[220px]">
                    {activityTitle}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-[var(--color-ink)] hover:bg-black/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-100 border-2 border-red-400 text-red-700 text-xs font-semibold rounded-xl text-center">
                {errorMsg}
              </div>
            )}

            {/* Camera & File Pick Option Buttons */}
            {!previewUrl ? (
              <div className="relative z-10 flex flex-col gap-3 my-4">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center justify-center gap-3 p-4 bg-[var(--color-pink)] text-[var(--color-ink)] rounded-2xl border-2 border-[var(--color-ink)] font-bold text-sm shadow-[4px_4px_0px_0px_rgba(58,50,56,0.2)] hover:bg-[#ff9eb6] transition-transform active:scale-95 cursor-pointer"
                >
                  <Camera className="w-6 h-6" />
                  Ambil Foto Langsung (Kamera)
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-3 p-4 bg-[var(--color-blue)] text-[var(--color-ink)] rounded-2xl border-2 border-[var(--color-ink)] font-bold text-sm shadow-[4px_4px_0px_0px_rgba(58,50,56,0.2)] hover:bg-[#8ec5ff] transition-transform active:scale-95 cursor-pointer"
                >
                  <ImageIcon className="w-6 h-6" />
                  Pilih Foto dari Galeri / File
                </button>
              </div>
            ) : (
              <div className="relative z-10 flex flex-col gap-4">
                {/* Image Preview Box */}
                <div className="relative w-full h-56 bg-black/10 rounded-2xl overflow-hidden border-2 border-[var(--color-ink)]">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black transition-colors"
                    title="Ganti Foto"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <Input
                  label="Caption / Catatan Foto (Opsional)"
                  placeholder="misal: Moment sunset indah di pantai"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  roughSeed={58}
                />

                <div className="flex items-center justify-end gap-3 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                  >
                    Batal Foto
                  </Button>
                  <Button type="button" variant="primary" isLoading={isUploading} onClick={handleSubmit}>
                    <Upload className="w-4 h-4" />
                    Simpan Foto ke R2
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
