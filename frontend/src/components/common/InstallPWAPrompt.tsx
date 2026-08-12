import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePWAInstall } from "../../hooks/usePWAInstall";
import { PencilBorder } from "../ui/PencilBorder";
import { Button } from "../ui/Button";
import { Compass, Download, Share, X } from "lucide-react";

export function InstallPWAPrompt() {
  const { isInstallable, isStandalone, isIOS, promptInstall } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    return sessionStorage.getItem("pwa_prompt_dismissed") === "true";
  });
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Do not show if already running as standalone PWA or dismissed
  if (isStandalone || isDismissed) {
    return null;
  }

  // Show if native installable OR on iOS Safari
  if (!isInstallable && !isIOS) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("pwa_prompt_dismissed", "true");
  };

  const handleInstallClick = () => {
    if (isInstallable) {
      promptInstall();
    } else if (isIOS) {
      setShowIOSGuide((prev) => !prev);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-md bg-[var(--color-cream)] p-4 rounded-[22px] shadow-[6px_8px_0px_0px_rgba(58,50,56,0.25)] text-[var(--color-ink)] transform-gpu"
      >
        <PencilBorder color="var(--color-ink)" roughness={1.8} strokeWidth={2.5} seed={42} />

        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[var(--color-pink)] rounded-xl border border-[var(--color-ink)] transform -rotate-3 shrink-0">
              <Compass className="w-6 h-6 text-[var(--color-ink)]" />
            </div>
            <div>
              <h4 className="font-display text-lg text-[var(--color-ink)] leading-none">
                Install Scrapbook App
              </h4>
              <p className="text-xs text-[var(--color-ink-soft)] font-medium mt-0.5">
                Buka lebih cepat langsung dari Layar Utama HP
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              type="button"
              variant="primary"
              onClick={handleInstallClick}
              className="py-1.5 px-3 text-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              <span>Install</span>
            </Button>

            <button
              type="button"
              onClick={handleDismiss}
              className="p-1.5 hover:bg-black/5 rounded-full transition-colors cursor-pointer text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* iOS Safari Instruction Guide */}
        {isIOS && showIOSGuide && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="relative z-10 mt-3 pt-3 border-t border-[var(--color-ink)]/15 text-xs text-[var(--color-ink-soft)]"
          >
            <p className="font-bold text-[var(--color-ink)] mb-1">
              Cara Install di iPhone / iPad (Safari):
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li>
                Tekan tombol <Share className="w-3.5 h-3.5 inline mx-0.5 text-blue-600" />{" "}
                <strong>Bagikan (Share)</strong> di bagian bawah Safari.
              </li>
              <li>
                Pilih menu <strong>"Tambahkan ke Layar Utama" (Add to Home Screen)</strong>.
              </li>
              <li>Tekan tombol <strong>Tambah</strong> di kanan atas.</li>
            </ol>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
