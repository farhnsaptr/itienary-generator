import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PencilBorder } from "../../../components/ui/PencilBorder";
import { Button } from "../../../components/ui/Button";
import {
  CrossIcon as X,
  DownloadIcon as Download,
  PhotoIcon as ImageIcon,
  FolderIcon,
} from "react-doodle-icons";
import type { Activity } from "../types/activities.types";
import { downloadPhotosAsZip } from "../../../utils/downloadHelpers";

interface DownloadZipModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity | null;
}

export function DownloadZipModal({ isOpen, onClose, activity }: DownloadZipModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

  if (!isOpen || !activity) return null;

  const photos = activity.activity_photos || [];
  const safeTitle = activity.title.replace(/[^a-zA-Z0-9_-]/g, "_");

  const handleDownload = async () => {
    if (photos.length === 0) return;
    try {
      setIsProcessing(true);
      setProgress({ current: 0, total: photos.length });

      const zipFileName = `Foto_${safeTitle}`;

      await downloadPhotosAsZip({
        photos,
        zipFileName,
        onProgress: (curr, total) => {
          setProgress({ current: curr, total });
        },
      });

      onClose();
    } catch (err: any) {
      console.error("ZIP Download error:", err);
      alert("Gagal membuat file ZIP foto: " + (err.message || err));
    } finally {
      setIsProcessing(false);
      setProgress(null);
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
            onClick={!isProcessing ? onClose : undefined}
            className="fixed inset-0 bg-black/65"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.18 }}
            className="relative w-full max-w-md bg-[var(--color-cream)] p-6 md:p-8 rounded-[26px] shadow-[8px_10px_0px_0px_rgba(58,50,56,0.2)] z-10 text-left transform-gpu"
          >
            <PencilBorder color="var(--color-ink)" roughness={1.8} strokeWidth={2.5} seed={99} />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between mb-5 pb-3 border-b-2 border-[var(--color-ink)]/20">
              <div className="flex items-center gap-2">
                <div className="p-2.5 bg-[var(--color-yellow)] rounded-xl border border-[var(--color-ink)] transform -rotate-3">
                  <FolderIcon className="w-5 h-5 text-[var(--color-ink)]" />
                </div>
                <div>
                  <h2 className="font-display text-2xl text-[var(--color-ink)] leading-none">
                    Download Semua Foto (.ZIP)
                  </h2>
                  <p className="text-xs text-[var(--color-ink-soft)] font-medium mt-0.5">
                    {photos.length} foto pada "{activity.title}"
                  </p>
                </div>
              </div>
              {!isProcessing && (
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 text-[var(--color-ink)] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Options Body */}
            <div className="relative z-10 flex flex-col gap-3">
              {isProcessing && progress ? (
                <div className="py-6 text-center flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-[var(--color-pink)] border-t-[var(--color-ink)] rounded-full animate-spin" />
                  <p className="font-display text-xl text-[var(--color-ink)]">
                    Memproses File ZIP ({progress.current}/{progress.total})...
                  </p>
                  <p className="text-xs text-[var(--color-ink-soft)]">
                    Mengunduh dan mengemas foto ke dalam arsip ZIP
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-[var(--color-ink-soft)] font-medium mb-1">
                    Unduh seluruh file foto asli dari kegiatan ini sekaligus sebagai file paket **.ZIP**:
                  </p>

                  <button
                    type="button"
                    onClick={handleDownload}
                    className="p-4 rounded-2xl bg-[var(--color-yellow)]/40 hover:bg-[var(--color-yellow)]/70 border-2 border-[var(--color-ink)] text-left transition-all cursor-pointer flex items-center justify-between group shadow-xs active:scale-98"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-[var(--color-yellow)] rounded-xl border border-[var(--color-ink)] shrink-0">
                        <ImageIcon className="w-5 h-5 text-[var(--color-ink)]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[var(--color-ink)] leading-tight">
                          Unduh Paket Foto (.ZIP)
                        </h4>
                        <p className="text-[11px] text-[var(--color-ink-soft)] mt-0.5">
                          {photos.length} file foto resolusi penuh
                        </p>
                      </div>
                    </div>
                    <Download className="w-5 h-5 text-[var(--color-ink)] group-hover:translate-y-0.5 transition-transform shrink-0" />
                  </button>
                </>
              )}

              <div className="flex justify-end mt-2">
                <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>
                  Batal
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
