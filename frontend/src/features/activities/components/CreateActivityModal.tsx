import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PencilBorder } from "../../../components/ui/PencilBorder";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { CrossIcon as X, DocAddIcon as Plus, CalendarIcon as Calendar, LocationPinIcon as MapPin, CutleryIcon as Utensils, CameraIcon as Camera, CoffeeCup1Icon as Coffee, NavigationIcon as Compass, HomeIcon as Bed, BagIcon as ShoppingBag, SunIcon as Sun, PlaneIcon as Plane } from "react-doodle-icons";
import type { CreateActivityFormData } from "../types/activities.types";

interface CreateActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripStartDate: string;
  tripEndDate: string;
  onSubmit: (data: CreateActivityFormData) => Promise<void>;
  isSubmitting?: boolean;
}

const ICON_OPTIONS = [
  { name: "map-pin", Icon: MapPin, label: "Lokasi" },
  { name: "utensils", Icon: Utensils, label: "Kuliner" },
  { name: "camera", Icon: Camera, label: "Foto" },
  { name: "coffee", Icon: Coffee, label: "Kafe" },
  { name: "compass", Icon: Compass, label: "Jelajah" },
  { name: "bed", Icon: Bed, label: "Hotel" },
  { name: "shopping-bag", Icon: ShoppingBag, label: "Belanja" },
  { name: "sun", Icon: Sun, label: "Wisata" },
  { name: "plane", Icon: Plane, label: "Transport" },
];

const COLOR_PRESETS = [
  { hex: "#FFB3C6", name: "Pink Pastel" },
  { hex: "#A2D2FF", name: "Blue Pastel" },
  { hex: "#FFD97D", name: "Yellow Crayon" },
  { hex: "#C1E1C1", name: "Mint Green" },
  { hex: "#E8AEB7", name: "Rose" },
];

export function CreateActivityModal({
  isOpen,
  onClose,
  tripStartDate,
  tripEndDate,
  onSubmit,
  isSubmitting = false,
}: CreateActivityModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [activityDate, setActivityDate] = useState(tripStartDate || "");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:30");
  const [selectedIcon, setSelectedIcon] = useState("map-pin");
  const [selectedColor, setSelectedColor] = useState("#FFB3C6");
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError("Judul kegiatan wajib diisi.");
      return;
    }

    if (!activityDate) {
      setFormError("Tanggal kegiatan wajib diisi.");
      return;
    }

    if (endTime === startTime) {
      setFormError("Jam selesai tidak boleh sama dengan jam mulai.");
      return;
    }

    try {
      await onSubmit({
        title,
        description: description || undefined,
        location: location || undefined,
        activity_date: activityDate,
        start_time: startTime,
        end_time: endTime,
        icon: selectedIcon,
        color: selectedColor,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setLocation("");
      onClose();
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Gagal menyimpan kegiatan.");
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
            className="relative w-full max-w-lg bg-[var(--color-cream)] p-6 md:p-8 rounded-[26px] shadow-[8px_10px_0px_0px_rgba(58,50,56,0.2)] z-10 max-h-[90vh] overflow-y-auto text-left transform-gpu"
          >
            <PencilBorder color="var(--color-ink)" roughness={2} strokeWidth={3} seed={62} />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between mb-5 pb-3 border-b-2 border-[var(--color-ink)]/20">
              <div className="flex items-center gap-2">
                <div className="p-2.5 bg-[var(--color-pink)] rounded-xl border border-[var(--color-ink)] transform -rotate-3">
                  <Calendar className="w-5 h-5 text-[var(--color-ink)]" />
                </div>
                <div>
                  <h2 className="font-display text-2xl md:text-3xl text-[var(--color-ink)] leading-none">
                    Tambah Activity Baru
                  </h2>
                  <p className="text-xs text-[var(--color-ink-soft)] font-medium mt-0.5">
                    Buat jadwal kegiatan pada timeline perjalanan
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

            {formError && (
              <div className="mb-4 p-3 bg-red-100 border-2 border-red-400 text-red-700 text-xs font-semibold rounded-xl text-center">
                {formError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-4">
              <Input
                label="Judul Kegiatan (Maks. 20 Karakter)"
                placeholder="misal: Makan Siang Beach Club"
                maxLength={20}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                roughSeed={64}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase text-[var(--color-ink)]">Tanggal</label>
                  <input
                    type="date"
                    min={tripStartDate}
                    max={tripEndDate}
                    value={activityDate}
                    onChange={(e) => setActivityDate(e.target.value)}
                    className="p-2.5 bg-white rounded-xl border-2 border-[var(--color-ink)] text-xs font-semibold text-[var(--color-ink)] focus:outline-none"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase text-[var(--color-ink)]">Jam Mulai</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="p-2.5 bg-white rounded-xl border-2 border-[var(--color-ink)] text-xs font-semibold text-[var(--color-ink)] focus:outline-none"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase text-[var(--color-ink)]">Jam Selesai</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="p-2.5 bg-white rounded-xl border-2 border-[var(--color-ink)] text-xs font-semibold text-[var(--color-ink)] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <Input
                label="Lokasi (Opsional)"
                placeholder="misal: Pantai Jimbaran, Bali"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                roughSeed={66}
              />

              <Input
                label="Deskripsi / Catatan (Maks. 25 Karakter)"
                placeholder="misal: Duduk di dekat pantai"
                maxLength={25}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                roughSeed={68}
              />

              {/* Icon Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-[var(--color-ink)]">Pilih Ikon Kegiatan</label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {ICON_OPTIONS.map(({ name, Icon, label }) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setSelectedIcon(name)}
                      className={`p-2.5 rounded-xl border-2 flex flex-col items-center gap-1 transition-transform cursor-pointer ${
                        selectedIcon === name
                          ? "bg-[var(--color-pink)] border-[var(--color-ink)] scale-105 shadow-xs"
                          : "bg-white border-gray-300 hover:border-gray-400"
                      }`}
                      title={label}
                    >
                      <Icon className="w-4 h-4 text-[var(--color-ink)]" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Presets */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-[var(--color-ink)]">Pilih Warna Kartu</label>
                <div className="flex items-center gap-3">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => setSelectedColor(preset.hex)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                        selectedColor === preset.hex
                          ? "border-[var(--color-ink)] scale-125 ring-2 ring-[var(--color-ink)]/30"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: preset.hex }}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-3">
                <Button type="button" variant="outline" onClick={onClose}>
                  Batal
                </Button>
                <Button type="submit" variant="primary" isLoading={isSubmitting} roughSeed={70}>
                  <Plus className="w-4 h-4" />
                  Simpan Kegiatan
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
