import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../store/authStore";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useNotifications } from "../../features/notifications";
import { PencilBorder } from "../ui/PencilBorder";
import { Button } from "../ui/Button";
import { CrossIcon as X, CopyIcon as Copy, TickIcon as Check, LogoutIcon as LogOut, UserIcon, BellIcon as Bell } from "react-doodle-icons";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const { user } = useAuthStore();
  const { logoutMutation } = useAuth();
  const { notificationsQuery, respondMutation } = useNotifications();
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  const notifications = notificationsQuery.data?.data || [];
  const pendingNotifications = notifications.filter((n) => n.status === "pending");

  const handleCopyCode = () => {
    if (user.user_code) {
      navigator.clipboard.writeText(user.user_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
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
            className="fixed inset-0 bg-black/65"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.18 }}
            className="relative w-full max-w-md bg-[var(--color-cream)] p-6 md:p-8 rounded-[26px] shadow-[8px_10px_0px_0px_rgba(58,50,56,0.2)] z-10 max-h-[90vh] overflow-y-auto transform-gpu"
          >
            <PencilBorder color="var(--color-ink)" roughness={1.8} strokeWidth={2.5} seed={33} />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between mb-6 pb-3 border-b-2 border-[var(--color-ink)]/20">
              <h2 className="font-display text-2xl md:text-3xl text-[var(--color-ink)] flex items-center gap-2">
                Profil Pengguna
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-[var(--color-ink)] hover:bg-black/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Info Card */}
            <div className="relative z-10 flex flex-col items-center text-center p-4 bg-white/60 rounded-[20px] border border-[var(--color-ink)]/20 mb-6">
              <div className="relative mb-3">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.username}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[var(--color-ink)] shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[var(--color-crayon-yellow)] border-2 border-[var(--color-ink)] flex items-center justify-center text-[var(--color-ink)] shadow-md">
                    <UserIcon className="w-8 h-8" />
                  </div>
                )}
                <span
                  className={`absolute -bottom-1 -right-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded-full border border-[var(--color-ink)] ${
                    user.role === "admin" ? "bg-[var(--color-pink)]" : "bg-[var(--color-blue)]"
                  }`}
                >
                  {user.role}
                </span>
              </div>

              <h3 className="font-display text-2xl text-[var(--color-ink)] leading-tight">
                {user.full_name || user.username}
              </h3>
              <p className="text-xs text-[var(--color-ink-soft)] mb-3">@{user.username}</p>

              {/* 8-Digit User Code Copy Box */}
              <div className="w-full flex flex-col items-center">
                <span className="text-[11px] font-semibold uppercase text-[var(--color-ink-soft)] mb-1">
                  User ID Unik (8-Digit)
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="w-full inline-flex items-center justify-between gap-2 px-4 py-2.5 bg-[var(--color-crayon-yellow)]/60 hover:bg-[var(--color-crayon-yellow)] border-2 border-dashed border-[var(--color-ink)] rounded-xl font-mono font-bold text-sm text-[var(--color-ink)] transition-colors cursor-pointer"
                >
                  <span>#{user.user_code || "--------"}</span>
                  <span className="flex items-center gap-1 text-xs font-sans font-semibold text-[var(--color-ink)]">
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Salin ID
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="relative z-10 mb-6">
              <div className="flex items-center justify-between mb-3 px-1">
                <h4 className="font-display text-xl text-[var(--color-ink)] flex items-center gap-1.5">
                  <Bell className="w-4 h-4" /> Undangan Trip ({pendingNotifications.length})
                </h4>
              </div>

              {pendingNotifications.length === 0 ? (
                <div className="p-4 text-center bg-white/30 rounded-xl border border-dashed border-[var(--color-ink)]/20 text-xs text-[var(--color-ink-soft)]">
                  Belum ada undangan trip baru.
                </div>
              ) : (
                <div className="flex flex-col gap-3 max-h-56 overflow-y-auto pr-1">
                  {pendingNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-3 bg-white rounded-xl border border-[var(--color-ink)]/20 flex flex-col gap-2 shadow-xs"
                    >
                      <div className="text-xs font-bold text-[var(--color-ink)]">{notif.title}</div>
                      <div className="text-xs text-[var(--color-ink-soft)] leading-snug">{notif.message}</div>
                      <div className="flex items-center justify-end gap-2 mt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={respondMutation.isPending}
                          onClick={() =>
                            respondMutation.mutate({ notificationId: notif.id, status: "rejected" })
                          }
                          className="px-3 py-1 text-xs min-h-[34px]"
                        >
                          Tolak
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={respondMutation.isPending}
                          onClick={() =>
                            respondMutation.mutate({ notificationId: notif.id, status: "accepted" })
                          }
                          className="px-3 py-1 text-xs min-h-[34px]"
                        >
                          Terima Undangan
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Actions (Logout) */}
            <div className="relative z-10 pt-4 border-t-2 border-[var(--color-ink)]/10 flex items-center justify-between">
              <Button variant="outline" onClick={onClose} className="text-xs">
                Tutup
              </Button>
              <Button
                variant="danger"
                isLoading={logoutMutation.isPending}
                onClick={() => logoutMutation.mutate()}
                className="text-xs gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                Keluar dari Akun
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
