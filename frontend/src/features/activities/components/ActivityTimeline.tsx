import { motion, AnimatePresence } from "framer-motion";
import type { Activity } from "../types/activities.types";
import { PencilBorder } from "../../../components/ui/PencilBorder";
import { getPhotoDisplayUrl } from "../../../utils/downloadHelpers";
import {
  ClockIcon as Clock,
  LocationPinIcon as MapPin,
  CutleryIcon as Utensils,
  CameraIcon as Camera,
  CoffeeCup1Icon as Coffee,
  NavigationIcon as Compass,
  HomeIcon as Bed,
  BagIcon as ShoppingBag,
  SunIcon as Sun,
  PlaneIcon as Plane,
  DeleteIcon as Trash2,
  DocAddIcon as Plus,
  PencilIcon as Pencil,
  DownloadIcon as Download,
} from "react-doodle-icons";

interface ActivityTimelineProps {
  activities: Activity[];
  canManageActivities?: boolean;
  canManagePhotos?: boolean;
  onEditActivity?: (activity: Activity) => void;
  onDeleteActivity?: (activityId: string) => void;
  onAddPhoto?: (activity: Activity) => void;
  onOpenGallery?: (activity: Activity, photoIndex: number) => void;
  onDownloadZip?: (activity: Activity) => void;
}

const ICON_MAP: Record<string, any> = {
  "map-pin": MapPin,
  utensils: Utensils,
  camera: Camera,
  coffee: Coffee,
  compass: Compass,
  bed: Bed,
  "shopping-bag": ShoppingBag,
  sun: Sun,
  plane: Plane,
};

export function ActivityTimeline({
  activities,
  canManageActivities = false,
  canManagePhotos = false,
  onEditActivity,
  onDeleteActivity,
  onAddPhoto,
  onOpenGallery,
  onDownloadZip,
}: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="p-8 text-center bg-white/40 rounded-[24px] border-2 border-dashed border-[var(--color-ink)]/30 my-6">
        <Compass className="w-10 h-10 text-[var(--color-ink-soft)] mx-auto mb-2" />
        <h4 className="font-display text-2xl text-[var(--color-ink)] mb-1">Belum Ada Activity</h4>
        <p className="text-xs text-[var(--color-ink-soft)]">
          Jadwal kegiatan untuk hari ini masih kosong. Klik "Tambah Activity" di atas!
        </p>
      </div>
    );
  }

  return (
    <div className="relative pl-6 md:pl-10 space-y-8 before:absolute before:left-3 md:before:left-5 before:top-3 before:bottom-3 before:w-1 before:bg-[var(--color-ink)]/30 before:rounded-full">
      <AnimatePresence mode="popLayout">
        {activities.map((act, index) => {
          const IconComponent = ICON_MAP[act.icon] || MapPin;
          const photos = act.activity_photos || [];

          return (
            <motion.div
              key={act.id}
              layout
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.85,
                x: 60,
                transition: { duration: 0.28, ease: "easeInOut" },
              }}
              transition={{ duration: 0.25 }}
              className="relative text-left transform-gpu"
            >
            {/* Timeline Dot Node */}
            <div
              className="absolute -left-[31px] md:-left-[47px] top-4 w-7 h-7 md:w-9 md:h-9 rounded-full border-2 border-[var(--color-ink)] flex items-center justify-center shadow-xs z-10"
              style={{ backgroundColor: act.color || "#FFB3C6" }}
            >
              <IconComponent className="w-3.5 h-3.5 md:w-4 md:h-4 text-[var(--color-ink)]" />
            </div>

            {/* Scrapbook Card */}
            <div
              className="relative p-5 rounded-[22px] bg-white/80 shadow-[4px_6px_0px_0px_rgba(58,50,56,0.15)] border border-[var(--color-ink)]/10"
            >
              <PencilBorder color="var(--color-ink)" roughness={1.4} seed={index + 10} strokeWidth={2} />

              {/* Time Badge & Delete Action */}
              <div className="relative z-10 flex items-center justify-between gap-2 mb-2">
                {(() => {
                  const isOvernight = act.end_time < act.start_time;
                  return (
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-full border border-[var(--color-ink)]"
                      style={{ backgroundColor: act.color || "#FFD97D" }}
                    >
                      <Clock className="w-3.5 h-3.5 text-[var(--color-ink)]" />
                      <span>{act.start_time} - {act.end_time}</span>
                      {isOvernight && (
                        <span className="text-[10px] bg-black/10 px-1.5 py-0.5 rounded-full font-sans font-semibold text-[var(--color-ink)] ml-0.5">
                          +1 hari
                        </span>
                      )}
                    </span>
                  );
                })()}

                <div className="flex items-center gap-1">
                  {canManageActivities && onEditActivity && (
                    <button
                      type="button"
                      onClick={() => onEditActivity(act)}
                      className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-transparent hover:border-blue-300 cursor-pointer"
                      title="Edit Kegiatan"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}

                  {canManageActivities && onDeleteActivity && (
                    <button
                      type="button"
                      onClick={() => {
                        const photoCount = photos.length;
                        const confirmMsg =
                          photoCount > 0
                            ? `Kegiatan "${act.title}" memiliki ${photoCount} foto. Menghapus kegiatan ini juga akan menghapus semua foto di dalamnya.\n\nApakah Anda yakin ingin menghapus?`
                            : `Apakah Anda yakin ingin menghapus kegiatan "${act.title}"?`;

                        if (confirm(confirmMsg)) {
                          onDeleteActivity(act.id);
                        }
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-transparent hover:border-red-300 cursor-pointer"
                      title="Hapus Kegiatan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <div className="relative z-10 mb-3">
                <h4 className="font-display text-2xl text-[var(--color-ink)] leading-tight">
                  {act.title}
                </h4>
                {act.location && (
                  <a
                    href={
                      act.location_url ||
                      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(act.location)}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 hover:underline mt-1.5 bg-blue-50/80 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors cursor-pointer group"
                    title="Buka Lokasi di Google Maps"
                  >
                    <MapPin className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
                    <span>{act.location}</span>
                  </a>
                )}
                {act.description && (
                  <p className="text-xs text-[var(--color-ink-soft)] font-normal mt-2 leading-relaxed">
                    {act.description}
                  </p>
                )}
              </div>

              {/* Photo Thumbnails & Upload Photo Action */}
              <div className="relative z-10 pt-3 border-t border-[var(--color-ink)]/10 flex flex-wrap items-center justify-between gap-2">
                {/* Thumbnails (Max 3 preview photos + Remaining count badge) */}
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {(() => {
                    const previewPhotos = photos.slice(0, 3);
                    const remainingCount = photos.length - 3;

                    return (
                      <>
                        {previewPhotos.map((photo, pIdx) => (
                          <button
                            key={photo.id}
                            type="button"
                            onClick={() => onOpenGallery?.(act, pIdx)}
                            className="relative w-12 h-12 rounded-lg border-2 border-[var(--color-ink)] overflow-hidden shadow-xs hover:scale-105 transition-transform cursor-pointer group"
                          >
                            <img
                              src={getPhotoDisplayUrl(photo.photo_url)}
                              alt={photo.caption || act.title}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}

                        {remainingCount > 0 && (
                          <button
                            type="button"
                            onClick={() => onOpenGallery?.(act, 3)}
                            className="relative w-12 h-12 rounded-lg border-2 border-[var(--color-ink)] bg-[var(--color-pink)] text-[var(--color-ink)] font-bold text-xs flex items-center justify-center shadow-xs hover:scale-105 transition-transform cursor-pointer"
                            title={`Lihat ${remainingCount} foto lagi`}
                          >
                            <span>+{remainingCount}</span>
                          </button>
                        )}
                      </>
                    );
                  })()}

                  {photos.length === 0 && (
                    <span className="text-[11px] text-[var(--color-ink-soft)] italic">
                      Belum ada foto kegiatan ini.
                    </span>
                  )}
                </div>

                {/* Action Buttons: Download ZIP & Upload Photo */}
                <div className="flex items-center gap-2 ml-auto">
                  {photos.length > 0 && onDownloadZip && (
                    <button
                      type="button"
                      onClick={() => onDownloadZip(act)}
                      className="px-3 py-1.5 bg-[var(--color-yellow)]/40 hover:bg-[var(--color-yellow)]/70 text-[var(--color-ink)] text-xs font-bold rounded-xl border border-[var(--color-ink)]/40 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      title="Download semua foto kegiatan ini sebagai file .ZIP"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download ZIP ({photos.length})</span>
                    </button>
                  )}

                  {canManagePhotos && onAddPhoto && (
                    <button
                      type="button"
                      onClick={() => onAddPhoto(act)}
                      className="px-3 py-1.5 bg-[var(--color-blue)]/30 hover:bg-[var(--color-blue)]/50 text-[var(--color-ink)] text-xs font-bold rounded-xl border border-[var(--color-ink)]/40 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <Camera className="w-3.5 h-3.5" />
                      <span>Tambah Foto</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
      </AnimatePresence>
    </div>
  );
}
