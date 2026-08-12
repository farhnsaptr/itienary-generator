import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PencilBorder } from "../../../components/ui/PencilBorder";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import {
  CrossIcon as X,
  PencilIcon as Pencil,
  LocationPinIcon as MapPin,
  CutleryIcon as Utensils,
  CameraIcon as Camera,
  CoffeeCup1Icon as Coffee,
  NavigationIcon as Compass,
  HomeIcon as Bed,
  BagIcon as ShoppingBag,
  SunIcon as Sun,
  PlaneIcon as Plane,
} from "react-doodle-icons";
import type { Activity, CreateActivityFormData } from "../types/activities.types";

interface EditActivityModalProps {
  activity: Activity | null;
  onClose: () => void;
  tripStartDate: string;
  tripEndDate: string;
  onSubmit: (activityId: string, data: Partial<CreateActivityFormData>) => Promise<void>;
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

export function EditActivityModal({
  activity,
  onClose,
  tripStartDate,
  tripEndDate,
  onSubmit,
  isSubmitting = false,
}: EditActivityModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [locationUrl, setLocationUrl] = useState("");
  const [activityDate, setActivityDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:30");
  const [selectedIcon, setSelectedIcon] = useState("map-pin");
  const [selectedColor, setSelectedColor] = useState("#FFB3C6");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (activity) {
      setTitle(activity.title || "");
      setDescription(activity.description || "");
      setLocation(activity.location || "");
      setLocationUrl(activity.location_url || "");
      setActivityDate(activity.activity_date || tripStartDate || "");
      setStartTime(activity.start_time || "09:00");
      setEndTime(activity.end_time || "10:30");
      setSelectedIcon(activity.icon || "map-pin");
      setSelectedColor(activity.color || "#FFB3C6");
      setFormError(null);
    }
  }, [activity, tripStartDate]);

  if (!activity) return null;

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

    const GOOGLE_MAPS_REGEX = /^https?:\/\/(www\.)?(maps\.app\.goo\.gl|goo\.gl\/maps|google\.[a-z.]+\/maps|maps\.google\.[a-z.]+)\/.+/i;
    if (locationUrl.trim() && !GOOGLE_MAPS_REGEX.test(locationUrl.trim())) {
      setFormError("Link harus berupa URL Google Maps yang valid (contoh: https://maps.app.goo.gl/P8W6P9pvmctQ18d66)");
      return;
    }

    const finalLocationUrl = locationUrl.trim() || undefined;

    try {
      await onSubmit(activity.id, {
        title,
        description: description || undefined,
        location: location || undefined,
        location_url: finalLocationUrl,
        activity_date: activityDate,
        start_time: startTime,
        end_time: endTime,
        icon: selectedIcon,
        color: selectedColor,
      });

      onClose();
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Gagal menyimpan kegiatan.");
    }
  };

  return (
    <AnimatePresence>
      {activity && (
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
            <PencilBorder color="var(--color-ink)" roughness={2} strokeWidth={3} seed={88} />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between mb-5 pb-3 border-b-2 border-[var(--color-ink)]/20">
              <div className="flex items-center gap-2">
                <div className="p-2.5 bg-[var(--color-blue)] rounded-xl border border-[var(--color-ink)] transform -rotate-3">
                  <Pencil className="w-5 h-5 text-[var(--color-ink)]" />
                </div>
                <div>
                  <h2 className="font-display text-2xl md:text-3xl text-[var(--color-ink)] leading-none">
                    Edit Activity
                  </h2>
                  <p className="text-xs text-[var(--color-ink-soft)] font-medium mt-0.5">
                    Ubah rincian kegiatan pada timeline
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-[var(--color-ink)] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
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
                roughSeed={89}
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
                label="Nama Lokasi (Opsional)"
                placeholder="misal: Universitas Brawijaya"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                roughSeed={90}
              />

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-[var(--color-ink)]">
                  Link Google Maps (Opsional)
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="https://maps.app.goo.gl/P8W6P9pvmctQ18d66"
                      value={locationUrl}
                      onChange={(e) => setLocationUrl(e.target.value)}
                      roughSeed={91}
                    />
                  </div>
                  {locationUrl.trim() && /^https?:\/\/(www\.)?(maps\.app\.goo\.gl|goo\.gl\/maps|google\.[a-z.]+\/maps|maps\.google\.[a-z.]+)\/.+/i.test(locationUrl.trim()) && (
                    <a
                      href={locationUrl.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2.5 bg-[var(--color-yellow)] hover:bg-[var(--color-yellow)]/80 text-[var(--color-ink)] text-xs font-bold rounded-xl border-2 border-[var(--color-ink)] transition-colors flex items-center gap-1 shrink-0 mt-1 cursor-pointer"
                      title="Tes Buka Link Google Maps"
                    >
                      <MapPin className="w-4 h-4" />
                      <span className="hidden sm:inline">Buka Link</span>
                    </a>
                  )}
                </div>
              </div>

              <Input
                label="Deskripsi / Catatan (Maks. 25 Karakter)"
                placeholder="misal: Duduk di dekat pantai"
                maxLength={25}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                roughSeed={91}
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
                <Button type="submit" variant="primary" isLoading={isSubmitting} roughSeed={92}>
                  <Pencil className="w-4 h-4" />
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
