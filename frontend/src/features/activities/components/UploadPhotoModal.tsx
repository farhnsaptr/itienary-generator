import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PencilBorder } from "../../../components/ui/PencilBorder";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import {
  CrossIcon as X,
  CameraIcon as Camera,
  PhotoIcon as ImageIcon,
  UploadIcon as Upload,
  DocAddIcon as Plus,
  DeleteIcon as Trash2,
} from "react-doodle-icons";

interface PhotoItemSelection {
  file: File;
  previewUrl: string;
}

interface UploadPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityTitle: string;
  onUpload: (files: File[], caption?: string) => Promise<void>;
  isUploading?: boolean;
}

export function UploadPhotoModal({
  isOpen,
  onClose,
  activityTitle,
  onUpload,
  isUploading = false,
}: UploadPhotoModalProps) {
  const [selectedItems, setSelectedItems] = useState<PhotoItemSelection[]>([]);
  const [caption, setCaption] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFilesAdded = (files: FileList | null) => {
    setErrorMsg(null);
    if (!files || files.length === 0) return;

    const newItems: PhotoItemSelection[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) {
        setErrorMsg("Beberapa file bukan berupa gambar dan telah diabaikan.");
        continue;
      }
      newItems.push({
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }

    if (newItems.length > 0) {
      setSelectedItems((prev) => [...prev, ...newItems]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setSelectedItems((prev) => {
      const target = prev[index];
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((_, idx) => idx !== index);
    });
  };

  const handleReset = () => {
    selectedItems.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setSelectedItems([]);
    setCaption("");
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      setErrorMsg("Silakan pilih minimal 1 foto terlebih dahulu.");
      return;
    }

    try {
      const filesToUpload = selectedItems.map((item) => item.file);
      await onUpload(filesToUpload, caption);
      handleReset();
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
            onClick={!isUploading ? onClose : undefined}
            className="fixed inset-0 bg-black/65"
          />

          {/* Hidden File Inputs */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleFilesAdded(e.target.files)}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFilesAdded(e.target.files)}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.18 }}
            className="relative w-full max-w-lg bg-[var(--color-cream)] p-6 md:p-8 rounded-[26px] shadow-[8px_10px_0px_0px_rgba(58,50,56,0.2)] z-10 max-h-[90vh] overflow-y-auto transform-gpu text-left"
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
                  <p className="text-xs text-[var(--color-ink-soft)] font-medium mt-0.5 truncate max-w-[240px]">
                    {activityTitle}
                  </p>
                </div>
              </div>
              {!isUploading && (
                <button
                  type="button"
                  onClick={() => {
                    handleReset();
                    onClose();
                  }}
                  className="p-2 text-[var(--color-ink)] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-100 border-2 border-red-400 text-red-700 text-xs font-semibold rounded-xl text-center">
                {errorMsg}
              </div>
            )}

            {/* Option Buttons when empty */}
            {selectedItems.length === 0 ? (
              <div className="relative z-10 flex flex-col gap-3 my-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-3 p-4 bg-[var(--color-blue)] text-[var(--color-ink)] rounded-2xl border-2 border-[var(--color-ink)] font-bold text-sm shadow-[4px_4px_0px_0px_rgba(58,50,56,0.2)] hover:bg-[#8ec5ff] transition-transform active:scale-95 cursor-pointer"
                >
                  <ImageIcon className="w-6 h-6" />
                  Pilih Beberapa Foto (Multi-Upload)
                </button>

                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center justify-center gap-3 p-4 bg-[var(--color-pink)] text-[var(--color-ink)] rounded-2xl border-2 border-[var(--color-ink)] font-bold text-sm shadow-[4px_4px_0px_0px_rgba(58,50,56,0.2)] hover:bg-[#ff9eb6] transition-transform active:scale-95 cursor-pointer"
                >
                  <Camera className="w-6 h-6" />
                  Ambil Foto dari Kamera
                </button>
              </div>
            ) : (
              /* Selected Photos Preview Grid */
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--color-ink)]">
                    {selectedItems.length} Foto Dipilih
                  </span>

                  {/* Add More Photos Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-[var(--color-yellow)] hover:bg-[var(--color-yellow)]/80 text-[var(--color-ink)] text-xs font-bold rounded-xl border border-[var(--color-ink)] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Foto Lain</span>
                  </button>
                </div>

                {/* Thumbnails Grid */}
                <div className="grid grid-cols-3 gap-2.5 max-h-60 overflow-y-auto p-2 bg-black/5 rounded-2xl border-2 border-[var(--color-ink)]/20">
                  {selectedItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square bg-gray-200 rounded-xl overflow-hidden border border-[var(--color-ink)]/30 group"
                    >
                      <img
                        src={item.previewUrl}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-transform active:scale-90 shadow-md cursor-pointer"
                        title="Hapus foto ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <Input
                  label="Caption / Catatan Foto (Berlaku untuk semua foto ini)"
                  placeholder="misal: Moment sunset indah di pantai"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  roughSeed={58}
                />

                <div className="flex items-center justify-end gap-3 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploading}
                    onClick={() => {
                      handleReset();
                      onClose();
                    }}
                  >
                    Batal
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    isLoading={isUploading}
                    onClick={handleSubmit}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Unggah {selectedItems.length} Foto</span>
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
