import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { createTripSchema, type CreateTripFormData } from "../types/trips.types";
import { useTrips } from "../hooks/useTrips";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { PencilBorder } from "../../../components/ui/PencilBorder";
import { CrossIcon as X, PlaneIcon as Plane, PaintBrushIcon as Palette } from "react-doodle-icons";

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const colorPresets = ["#FFB3C6", "#A2D2FF", "#FFD97D", "#B5EAD7", "#C7CEEA", "#F3C4FB"];

export function CreateTripModal({ isOpen, onClose }: CreateTripModalProps) {
  const { createTripMutation } = useTrips();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateTripFormData>({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      theme_color: "#FFB3C6",
    },
  });

  const selectedColor = watch("theme_color");

  const onSubmit = (data: CreateTripFormData) => {
    createTripMutation.mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
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
            className="relative w-full max-w-lg bg-[var(--color-cream)] p-6 md:p-8 rounded-[24px] shadow-[8px_10px_0px_0px_rgba(58,50,56,0.2)] z-10 max-h-[90vh] overflow-y-auto transform-gpu"
          >
            <PencilBorder color="var(--color-ink)" roughness={2} strokeWidth={3} seed={20} />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between mb-6 pb-3 border-b-2 border-[var(--color-ink)]/20">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[var(--color-crayon-yellow)] rounded-xl border border-[var(--color-ink)] transform -rotate-3">
                  <Plane className="w-5 h-5 text-[var(--color-ink)]" />
                </div>
                <h2 className="font-display text-2xl md:text-3xl text-[var(--color-ink)]">
                  Buat Trip Baru
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-[var(--color-ink)] hover:bg-black/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Error */}
            {createTripMutation.isError && (
              <div className="mb-4 p-3 bg-red-100 border-2 border-red-400 text-red-700 text-xs font-semibold rounded-xl text-center">
                {(createTripMutation.error as any).response?.data?.message || "Gagal membuat trip."}
              </div>
            )}

            {/* Form Body */}
            <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 flex flex-col gap-4">
              <Input
                label="Nama Trip (Maks. 20 Karakter)"
                placeholder="misal: Liburan Bali 2026"
                maxLength={20}
                {...register("name")}
                error={errors.name?.message}
                roughSeed={10}
              />

              <Input
                label="Deskripsi Singkat (Maks. 25 Karakter)"
                placeholder="misal: Eksplor pantai & kuliner"
                maxLength={25}
                {...register("description")}
                error={errors.description?.message}
                roughSeed={11}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Tanggal Mulai"
                  type="date"
                  {...register("start_date")}
                  error={errors.start_date?.message}
                  roughSeed={12}
                />
                <Input
                  label="Tanggal Selesai"
                  type="date"
                  {...register("end_date")}
                  error={errors.end_date?.message}
                  roughSeed={13}
                />
              </div>

              {/* Theme Color Picker */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-[var(--color-ink)] uppercase tracking-wide flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5" /> Warna Aksen Tema
                </label>
                <div className="flex items-center gap-3">
                  {colorPresets.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setValue("theme_color", color)}
                      className={`w-8 h-8 rounded-full border-2 border-[var(--color-ink)] transition-transform ${
                        selectedColor === color ? "scale-125 ring-2 ring-black" : "hover:scale-110"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Batal
                </Button>
                <Button type="submit" variant="primary" isLoading={createTripMutation.isPending}>
                  Simpan Trip
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
