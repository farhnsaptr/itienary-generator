import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PencilBorder } from "../ui/PencilBorder";
import { Button } from "../ui/Button";
import {
  Compass,
  ShieldAlert,
  WifiOff,
  Home,
  RefreshCw,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";

export type ErrorType = "404" | "403" | "offline" | "custom";

export interface ErrorStateProps {
  type?: ErrorType;
  code?: string | number;
  title?: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  icon?: React.ReactNode;
  fullScreen?: boolean;
  className?: string;
}

const ERROR_CONFIGS: Record<
  "404" | "403" | "offline",
  {
    code: string;
    title: string;
    subtitle: string;
    badgeColor: string;
    icon: React.ReactNode;
    defaultActionText: string;
  }
> = {
  "404": {
    code: "404",
    title: "Halaman Tidak Ditemukan",
    subtitle:
      "Jejak perjalanan di scrapbook ini tersesat atau halaman yang Anda cari telah dipindahkan.",
    badgeColor: "bg-[var(--color-pink)]",
    icon: <Compass className="w-10 h-10 text-[var(--color-ink)]" />,
    defaultActionText: "Kembali ke Dashboard",
  },
  "403": {
    code: "403",
    title: "Akses Dibatasi",
    subtitle:
      "Area khusus! Anda tidak memiliki hak akses yang cukup untuk membuka atau mengedit halaman ini.",
    badgeColor: "bg-[var(--color-yellow)]",
    icon: <ShieldAlert className="w-10 h-10 text-[var(--color-ink)]" />,
    defaultActionText: "Kembali ke Dashboard",
  },
  offline: {
    code: "OFFLINE",
    title: "Koneksi Internet Terputus",
    subtitle:
      "Perangkat Anda sedang tidak terhubung ke internet. Mohon periksa sambungan Wi-Fi atau data seluler Anda.",
    badgeColor: "bg-[var(--color-blue)]",
    icon: <WifiOff className="w-10 h-10 text-[var(--color-ink)]" />,
    defaultActionText: "Coba Muat Ulang",
  },
};

export function ErrorState({
  type = "404",
  code,
  title,
  subtitle,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  icon,
  fullScreen = true,
  className = "",
}: ErrorStateProps) {
  const navigate = useNavigate();
  const config = type !== "custom" ? ERROR_CONFIGS[type] : null;

  const displayCode = code || config?.code || "ERR";
  const displayTitle = title || config?.title || "Terjadi Kesalahan";
  const displaySubtitle =
    subtitle ||
    config?.subtitle ||
    "Maaf, sistem mengalami kendala yang tidak terduga. Silakan coba kembali.";
  const displayIcon = icon || config?.icon || <AlertTriangle className="w-10 h-10 text-[var(--color-ink)]" />;
  const badgeColor = config?.badgeColor || "bg-[var(--color-pink)]";

  const handlePrimaryClick = () => {
    if (onAction) {
      onAction();
    } else if (type === "offline") {
      window.location.reload();
    } else {
      navigate("/dashboard");
    }
  };

  const handleSecondaryClick = () => {
    if (onSecondaryAction) {
      onSecondaryAction();
    } else {
      navigate(-1);
    }
  };

  const content = (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`relative w-full max-w-md bg-[var(--color-cream)] p-6 md:p-8 rounded-[28px] shadow-[8px_10px_0px_0px_rgba(58,50,56,0.2)] text-center ${className}`}
    >
      <PencilBorder color="var(--color-ink)" roughness={2} strokeWidth={3} seed={88} />

      {/* Decorative Icon Container */}
      <div className="relative z-10 flex justify-center mb-5">
        <motion.div
          animate={{ rotate: [0, -3, 3, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className={`p-4 ${badgeColor} rounded-2xl border-2 border-[var(--color-ink)] shadow-[4px_4px_0px_0px_rgba(58,50,56,0.15)] flex items-center justify-center transform -rotate-3`}
        >
          {displayIcon}
        </motion.div>
      </div>

      {/* Code Badge */}
      <div className="relative z-10 inline-block mb-3 px-3 py-1 bg-black/5 rounded-full border border-[var(--color-ink)]/20">
        <span className="font-mono text-xs font-bold text-[var(--color-ink-soft)] tracking-wider">
          STATUS: {displayCode}
        </span>
      </div>

      {/* Title */}
      <h1 className="relative z-10 font-display text-3xl md:text-4xl text-[var(--color-ink)] leading-tight mb-2">
        {displayTitle}
      </h1>

      {/* Subtitle */}
      <p className="relative z-10 text-xs md:text-sm text-[var(--color-ink-soft)] font-medium leading-relaxed mb-6 max-w-xs mx-auto">
        {displaySubtitle}
      </p>

      {/* Action Buttons */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button
          type="button"
          variant="primary"
          onClick={handlePrimaryClick}
          className="w-full sm:w-auto"
        >
          {type === "offline" ? (
            <RefreshCw className="w-4 h-4 mr-1.5" />
          ) : (
            <Home className="w-4 h-4 mr-1.5" />
          )}
          <span>{actionText || config?.defaultActionText || "Kembali Utama"}</span>
        </Button>

        {type !== "offline" && (
          <Button
            type="button"
            variant="outline"
            onClick={handleSecondaryClick}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>{secondaryActionText || "Kembali"}</span>
          </Button>
        )}
      </div>
    </motion.div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[var(--color-cream)]">
        {content}
      </div>
    );
  }

  return content;
}
