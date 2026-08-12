import { LoginForm } from "../features/auth";
import { PageTransition } from "../components/layout/PageTransition";
import { motion } from "framer-motion";
import { PlaneIcon as Plane, LocationPinIcon as MapPin } from "react-doodle-icons";

export function LoginPage() {
  return (
    <PageTransition className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[var(--color-cream)]">
      {/* Decorative Hand-Drawn Scribbles / Crayon Background Details */}
      <motion.div
        animate={{ rotate: [0, 10, -5, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-10 w-32 h-32 bg-[var(--color-pink)]/20 rounded-full blur-2xl pointer-events-none"
      />
      <motion.div
        animate={{ rotate: [0, -15, 10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-10 w-48 h-48 bg-[var(--color-blue)]/20 rounded-full blur-2xl pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-20 hidden md:flex items-center gap-1.5 text-2xl font-display text-[var(--color-ink-soft)]/40 pointer-events-none transform rotate-12"
      >
        <Plane className="w-6 h-6" /> Liburan Impianmu
      </motion.div>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-20 hidden md:flex items-center gap-1.5 text-2xl font-display text-[var(--color-ink-soft)]/40 pointer-events-none transform -rotate-12"
      >
        <MapPin className="w-6 h-6" /> Pantai & Kuliner
      </motion.div>

      {/* Main Form Container */}
      <LoginForm />
    </PageTransition>
  );
}
