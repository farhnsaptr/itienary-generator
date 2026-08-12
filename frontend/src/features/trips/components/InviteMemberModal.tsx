import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Trip } from "../types/trips.types";
import { useTrips } from "../hooks/useTrips";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { PencilBorder } from "../../../components/ui/PencilBorder";
import { CrossIcon as X, PencilIcon as Pencil, ShieldIcon as Shield, ChecklistIcon as CheckSquare, SquareIcon as Square, CalendarIcon as Calendar, CameraIcon as Camera, StarIcon as Sparkles } from "react-doodle-icons";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip | null;
}

export function InviteMemberModal({ isOpen, onClose, trip }: InviteMemberModalProps) {
  const { inviteMemberMutation } = useTrips();
  const [userCode, setUserCode] = useState("");
  const [canManageActivities, setCanManageActivities] = useState(false);
  const [canManagePhotos, setCanManagePhotos] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!trip) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    const cleanedCode = userCode.trim().replace("#", "");
    if (!cleanedCode) {
      setFormError("Silakan masukkan User ID 8-digit target.");
      return;
    }

    inviteMemberMutation.mutate(
      {
        tripId: trip.id,
        data: {
          userCode: cleanedCode,
          can_manage_activities: canManageActivities,
          can_manage_photos: canManagePhotos,
        },
      },
      {
        onSuccess: () => {
          setSuccessMessage("Undangan trip berhasil dikirim ke pengguna!");
          setUserCode("");
          setCanManageActivities(false);
          setCanManagePhotos(false);
          setTimeout(() => {
            setSuccessMessage(null);
            onClose();
          }, 1800);
        },
        onError: (err: any) => {
          setFormError(err.response?.data?.message || "Gagal mengundang anggota.");
        },
      }
    );
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
            className="fixed inset-0 bg-black/65"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.18 }}
            className="relative w-full max-w-lg bg-[var(--color-cream)] p-6 md:p-8 rounded-[26px] shadow-[8px_10px_0px_0px_rgba(58,50,56,0.2)] z-10 max-h-[90vh] overflow-y-auto text-left transform-gpu"
          >
            <PencilBorder color="var(--color-ink)" roughness={2} strokeWidth={3} seed={42} />

            {/* Scrapbook Header */}
            <div className="relative z-10 flex items-center justify-between mb-5 pb-3 border-b-2 border-[var(--color-ink)]/20">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[var(--color-pink)] rounded-2xl border-2 border-[var(--color-ink)] transform -rotate-3 shadow-xs">
                  <Pencil className="w-6 h-6 text-[var(--color-ink)]" />
                </div>
                <div>
                  <h2 className="font-display text-3xl text-[var(--color-ink)] leading-none">
                    Undang Member Trip
                  </h2>
                  <p className="text-xs text-[var(--color-ink-soft)] font-semibold mt-1">
                    Trip: <span className="text-[var(--color-ink)] font-bold">{trip.name}</span>
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

            {/* Status Messages */}
            {formError && (
              <div className="mb-4 p-3 bg-red-100 border-2 border-red-400 text-red-700 text-xs font-semibold rounded-xl text-center">
                {formError}
              </div>
            )}
            {successMessage && (
              <div className="mb-4 p-3 bg-emerald-100 border-2 border-emerald-400 text-emerald-800 text-xs font-bold rounded-xl text-center">
                {successMessage}
              </div>
            )}

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-4">
              <Input
                label="User ID 8-Digit Target"
                placeholder="Masukkan 8-digit ID (misal: 84920147)"
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                roughSeed={44}
              />

              {/* Granular Permission Section */}
              <div className="flex flex-col gap-2.5 p-4 bg-white/60 rounded-[20px] border-2 border-[var(--color-ink)]/20 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink)] flex items-center gap-1.5 mb-0.5">
                  <Shield className="w-4 h-4 text-[var(--color-ink)]" /> Konfigurasi Hak Akses Anggota
                </div>

                {/* Manage Activity Toggle Card */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setCanManageActivities(!canManageActivities)}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border-2 transition-all text-left cursor-pointer ${
                    canManageActivities
                      ? "bg-[var(--color-pink)]/20 border-[var(--color-ink)]"
                      : "bg-white/80 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="mt-0.5 text-[var(--color-ink)]">
                    {canManageActivities ? (
                      <CheckSquare className="w-5 h-5 text-[var(--color-ink)]" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[var(--color-ink)] flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[var(--color-ink)]" /> Kelola Activities (Kegiatan)
                    </div>
                    <div className="text-[11px] text-[var(--color-ink-soft)] leading-relaxed mt-0.5">
                      Dapat menambah, mengedit, dan menghapus jadwal kegiatan trip.
                      <span className="block italic text-[10px] text-gray-500 mt-0.5">
                        (Jika tidak dicentang: Hanya dapat melihat kegiatan)
                      </span>
                    </div>
                  </div>
                </motion.button>

                {/* Manage Photos Toggle Card */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setCanManagePhotos(!canManagePhotos)}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border-2 transition-all text-left cursor-pointer ${
                    canManagePhotos
                      ? "bg-[var(--color-blue)]/20 border-[var(--color-ink)]"
                      : "bg-white/80 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="mt-0.5 text-[var(--color-ink)]">
                    {canManagePhotos ? (
                      <CheckSquare className="w-5 h-5 text-[var(--color-ink)]" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[var(--color-ink)] flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-[var(--color-ink)]" /> Kelola Foto (Galeri)
                    </div>
                    <div className="text-[11px] text-[var(--color-ink-soft)] leading-relaxed mt-0.5">
                      Dapat mengunggah, mengedit, dan menghapus foto-foto kegiatan.
                      <span className="block italic text-[10px] text-gray-500 mt-0.5">
                        (Jika tidak dicentang: Hanya dapat melihat foto)
                      </span>
                    </div>
                  </div>
                </motion.button>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 mt-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={inviteMemberMutation.isPending}
                  roughSeed={48}
                  className="gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Kirim Undangan
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
