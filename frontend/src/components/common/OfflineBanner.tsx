import { motion, AnimatePresence } from "framer-motion";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import { WifiOff, RefreshCw } from "lucide-react";

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.2 }}
          className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md bg-[var(--color-pink)] text-[var(--color-ink)] px-4 py-2.5 rounded-2xl border-2 border-[var(--color-ink)] shadow-[4px_4px_0px_0px_rgba(58,50,56,0.2)] flex items-center justify-between gap-3 text-xs font-bold"
        >
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-red-700 animate-pulse shrink-0" />
            <span>Koneksi terputus (Anda sedang Offline)</span>
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="p-1 hover:bg-black/10 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0"
            title="Coba Muat Ulang"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Coba Lagi</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
