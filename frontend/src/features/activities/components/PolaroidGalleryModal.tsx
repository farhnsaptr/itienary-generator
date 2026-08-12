import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ActivityPhotoItem } from "../types/activities.types";
import {
  CrossIcon as X,
  ChevronsLeftIcon as ChevronLeft,
  ChevronsRightIcon as ChevronRight,
  DeleteIcon as Trash2,
  DownloadIcon as Download,
} from "react-doodle-icons";
import { downloadOriginalPhoto } from "../../../utils/downloadHelpers";

interface PolaroidGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: ActivityPhotoItem[];
  activityTitle: string;
  canManagePhotos?: boolean;
  onDeletePhoto?: (photoId: string) => void;
}

export function PolaroidGalleryModal({
  isOpen,
  onClose,
  photos,
  activityTitle,
  canManagePhotos = false,
  onDeletePhoto,
}: PolaroidGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
  }, [photos]);

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex] || photos[0];

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const ext = currentPhoto.photo_url.split(".").pop()?.split("?")[0] || "jpg";
      const fileName = `foto_${activityTitle.replace(/\s+/g, "_")}_${currentIndex + 1}.${ext}`;
      await downloadOriginalPhoto(currentPhoto.photo_url, fileName);
    } catch (err: any) {
      console.error("Download photo error:", err);
      alert("Gagal mengunduh foto: " + (err.message || err));
    } finally {
      setIsDownloading(false);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    if (info.offset.x < -50) {
      handleNext();
    } else if (info.offset.x > 50) {
      handlePrev();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90"
          />

          {/* Header Action Buttons (Kanan Atas) */}
          <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
            {/* Tombol Download Individual Foto */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-3.5 py-2 bg-white/20 hover:bg-white/35 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer border border-white/20"
              title="Unduh Foto Ini"
            >
              <Download className="w-4 h-4 text-white" />
              <span>Download Foto</span>
            </button>

            {canManagePhotos && onDeletePhoto && (
              <button
                type="button"
                onClick={() => {
                  if (confirm("Apakah Anda yakin ingin menghapus foto ini?")) {
                    onDeletePhoto(currentPhoto.id);
                  }
                }}
                className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-transform active:scale-95 shadow-lg border border-white/20 cursor-pointer ml-1"
                title="Hapus Foto Ini"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-transform active:scale-95 shadow-lg cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Counter Badge */}
          <div className="fixed top-4 left-4 z-50 px-3.5 py-1.5 bg-black/60 text-white font-mono text-xs font-bold rounded-full border border-white/30">
            Foto {currentIndex + 1} dari {photos.length}
          </div>

          {/* Navigation Arrows (Desktop) */}
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 z-50 p-3 bg-white/30 hover:bg-white/80 text-[var(--color-ink)] hover:text-black rounded-full border border-white/50 transition-all shadow-xl active:scale-90"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-50 p-3 bg-white/30 hover:bg-white/80 text-[var(--color-ink)] hover:text-black rounded-full border border-white/50 transition-all shadow-xl active:scale-90"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Main Photo Frame Container */}
          <motion.div
            key={currentPhoto.id}
            initial={{ opacity: 0, rotate: currentIndex % 2 === 0 ? -2 : 2 }}
            animate={{ opacity: 1, rotate: currentIndex % 2 === 0 ? -1 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="relative z-10 w-full max-w-sm sm:max-w-md bg-white p-4 pb-8 rounded-sm shadow-xl border border-gray-200 text-center select-none transform-gpu"
          >
            {/* Washi Sticker on top */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-amber-200/80 border-t border-b border-amber-400/40 shadow-xs transform rotate-2 pointer-events-none opacity-80" />

            {/* Image Frame */}
            <div className="relative w-full h-[320px] sm:h-[400px] bg-gray-100 overflow-hidden rounded-xs border border-gray-300">
              <img
                src={currentPhoto.photo_url}
                alt={currentPhoto.caption || activityTitle}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Caption & Date */}
            <div className="mt-3 px-2 text-center">
              <h3 className="font-display text-2xl text-[var(--color-ink)] leading-tight tracking-wide">
                {currentPhoto.caption || activityTitle}
              </h3>
              <p className="text-[11px] font-sans font-semibold text-[var(--color-ink-soft)] mt-0.5">
                {new Date(currentPhoto.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </motion.div>

          {/* Bottom Thumbnail Strip (Desktop & Mobile Scroll) */}
          {photos.length > 1 && (
            <div className="fixed bottom-4 inset-x-0 z-50 flex items-center justify-center gap-2 px-4 overflow-x-auto">
              {photos.map((photo, idx) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-12 h-12 rounded-lg border-2 overflow-hidden transition-all ${
                    idx === currentIndex
                      ? "border-white scale-110 shadow-lg ring-2 ring-[var(--color-pink)]"
                      : "border-white/40 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={photo.photo_url} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
