import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useNotifications } from "../../features/notifications";
import { Button } from "../ui/Button";
import { UserProfileModal } from "./UserProfileModal";
import { NavigationIcon as Compass, UserIcon, ShieldIcon as ShieldCheck, LocationPinIcon as MapPin } from "react-doodle-icons";
import { PencilBorder } from "../ui/PencilBorder";

export function Navbar() {
  const { user } = useAuthStore();
  const location = useLocation();
  const { notificationsQuery } = useNotifications();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifications = notificationsQuery.data?.data || [];
  const pendingCount = notifications.filter((n) => n.status === "pending").length;

  return (
    <>
      <header className="relative w-full max-w-6xl mx-auto px-4 py-4 mb-6">
        <div className="relative bg-[var(--color-cream)] p-4 rounded-[22px] flex items-center justify-between shadow-[4px_6px_0px_0px_rgba(162,210,255,0.4)]">
          <PencilBorder color="var(--color-ink)" roughness={1.5} seed={5} />

          {/* Brand Logo & Nav Links */}
          <div className="flex items-center gap-4 relative z-10">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="p-2 bg-[var(--color-pink)] rounded-xl transform -rotate-3 border-2 border-[var(--color-ink)]">
                <Compass className="w-6 h-6 text-[var(--color-ink)]" />
              </div>
              <div>
                <h1 className="font-display text-2xl md:text-3xl text-[var(--color-ink)] tracking-wide leading-none">
                  Itinerary Scrapbook
                </h1>
                <p className="text-[10px] md:text-xs font-medium text-[var(--color-ink-soft)] hidden sm:block">
                  Buat & Rencanakan Liburan Serumu!
                </p>
              </div>
            </Link>

            {/* Navigation Links */}
            {user && (
              <nav className="hidden md:flex items-center gap-2 ml-4">
                <Link to="/dashboard">
                  <Button
                    variant={location.pathname === "/dashboard" ? "primary" : "ghost"}
                    size="sm"
                    className="text-xs"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    Trip Saya
                  </Button>
                </Link>

                {user.role === "admin" && (
                  <Link to="/admin/users">
                    <Button
                      variant={location.pathname.startsWith("/admin") ? "secondary" : "ghost"}
                      size="sm"
                      className="text-xs"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Kelola User
                    </Button>
                  </Link>
                )}
              </nav>
            )}
          </div>

          {/* User Profile & Notification Badge Trigger */}
          {user && (
            <div className="flex items-center gap-3 relative z-10">
              {/* Mobile Admin Nav Link */}
              {user.role === "admin" && (
                <Link to="/admin/users" className="md:hidden">
                  <Button variant="secondary" size="sm" className="text-xs px-2.5">
                    <ShieldCheck className="w-4 h-4" />
                  </Button>
                </Link>
              )}

              {/* Profile Avatar Button */}
              <button
                type="button"
                onClick={() => setIsProfileOpen(true)}
                className="relative flex items-center gap-2 bg-[var(--color-blue)]/20 hover:bg-[var(--color-blue)]/40 px-3 py-1.5 rounded-full border border-[var(--color-ink)]/30 transition-colors cursor-pointer"
              >
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.username}
                    className="w-7 h-7 rounded-full object-cover border border-[var(--color-ink)]"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[var(--color-crayon-yellow)] flex items-center justify-center border border-[var(--color-ink)]">
                    <UserIcon className="w-4 h-4 text-[var(--color-ink)]" />
                  </div>
                )}
                <span className="text-xs font-semibold text-[var(--color-ink)] max-w-[100px] truncate hidden sm:inline">
                  {user.full_name || user.username}
                </span>

                {/* Unread Notifications Badge */}
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white animate-pulse">
                    {pendingCount}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* User Profile & Notifications Modal */}
      <UserProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
}
