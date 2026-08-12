import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { Trip } from "../types/trips.types";
import { PencilBorder } from "../../../components/ui/PencilBorder";
import { CalendarIcon as Calendar, DeleteIcon as Trash2, PencilIcon as Pencil } from "react-doodle-icons";
import { useTrips } from "../hooks/useTrips";

interface TripCardProps {
  trip: Trip;
  index: number;
  onInvite?: (trip: Trip) => void;
}

export function TripCard({ trip, index, onInvite }: TripCardProps) {
  const navigate = useNavigate();
  const { deleteTripMutation } = useTrips();

  const isEven = index % 2 === 0;
  const cardBg = isEven ? "bg-[var(--color-pink)]/20" : "bg-[var(--color-blue)]/20";
  const shadowColor = isEven ? "rgba(255, 179, 198, 0.5)" : "rgba(162, 210, 255, 0.5)";
  const rotation = isEven ? "rotate-[-1deg]" : "rotate-[1deg]";

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Apakah Anda yakin ingin menghapus trip "${trip.name}"?`)) {
      deleteTripMutation.mutate(trip.id);
    }
  };

  const handleInvite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onInvite?.(trip);
  };

  const handleCardClick = () => {
    navigate(`/trips/${trip.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: Math.min(index * 0.03, 0.15), duration: 0.18 }}
      whileHover={{ y: -3, scale: 1.01 }}
      onClick={handleCardClick}
      className={`relative p-6 rounded-[24px] ${cardBg} ${rotation} transition-shadow cursor-pointer flex flex-col justify-between min-h-[200px] text-left transform-gpu`}
      style={{
        boxShadow: `5px 7px 0px 0px ${shadowColor}`,
      }}
    >
      <PencilBorder color="var(--color-ink)" roughness={1.5} seed={index + 3} strokeWidth={2} />

      {/* Top Header Actions (Only for Owner) */}
      <div className="relative z-10 flex items-center justify-end gap-1.5 mb-1">
        {trip.my_role === "owner" && (
          <>
            <button
              onClick={handleInvite}
              className="px-3 py-1.5 bg-white/90 hover:bg-white text-[var(--color-ink)] text-xs font-bold rounded-xl border-2 border-[var(--color-ink)] shadow-xs transition-transform active:scale-95 flex items-center gap-1.5 min-h-[36px]"
              title="Undang Member"
            >
              <Pencil className="w-4 h-4 text-[var(--color-ink)] transform -rotate-12" />
              <span>Undang</span>
            </button>

            <button
              onClick={handleDelete}
              disabled={deleteTripMutation.isPending}
              className="p-2 rounded-xl text-red-600 hover:bg-red-200/50 transition-colors border border-transparent hover:border-red-400 min-h-[36px] flex items-center justify-center"
              title="Hapus Trip"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Prominent Enlarged Trip Title & Description */}
      <div className="relative z-10 mb-4 my-auto">
        <h3 className="font-display text-3xl md:text-4xl text-[var(--color-ink)] leading-tight tracking-wide mb-1.5">
          {trip.name}
        </h3>
        {trip.description && (
          <p className="text-xs text-[var(--color-ink-soft)] line-clamp-2 font-normal leading-relaxed">
            {trip.description}
          </p>
        )}
      </div>

      {/* Date & Footer */}
      <div className="relative z-10 pt-3 border-t border-[var(--color-ink)]/20 flex items-center justify-between text-xs font-semibold text-[var(--color-ink-soft)] mt-auto">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-[var(--color-ink)]" />
          <span>
            {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
