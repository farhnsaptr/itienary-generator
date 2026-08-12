import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "../components/layout/Navbar";
import { PageTransition } from "../components/layout/PageTransition";
import { useAuthStore } from "../store/authStore";
import { useTrips, TripCard, CreateTripModal } from "../features/trips";
import { InviteMemberModal } from "../features/trips/components/InviteMemberModal";
import type { Trip } from "../features/trips";
import { Button } from "../components/ui/Button";
import { DocAddIcon as Plus, NavigationIcon as Compass } from "react-doodle-icons";
import { PencilBorder } from "../components/ui/PencilBorder";

export function DashboardPage() {
  const { user } = useAuthStore();
  const { tripsQuery } = useTrips();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTripToInvite, setSelectedTripToInvite] = useState<Trip | null>(null);

  const trips = tripsQuery.data || [];

  return (
    <PageTransition className="min-h-screen bg-[var(--color-cream)] pb-12">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4">
        {/* Banner Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-[var(--color-pink)]/20 p-6 md:p-8 rounded-[24px] mb-8 text-left border border-[var(--color-ink)]/10"
        >
          <PencilBorder color="var(--color-ink)" roughness={1.6} seed={7} />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl md:text-5xl text-[var(--color-ink)] leading-none mb-2">
                Halo, {user?.full_name || user?.username}!
              </h2>
              <p className="text-xs md:text-sm text-[var(--color-ink-soft)] font-normal max-w-xl">
                Temukan & kelola rencana liburanmu dalam kartu itinerary bergaya scrapbook kreatif!
              </p>
            </div>

            <div>
              <Button
                variant="primary"
                size="lg"
                onClick={() => setIsModalOpen(true)}
                roughSeed={15}
                className="w-full md:w-auto shadow-[4px_6px_0px_0px_rgba(58,50,56,0.3)]"
              >
                <Plus className="w-5 h-5" />
                Buat Trip Baru
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Trips Grid Section */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-display text-2xl md:text-3xl text-[var(--color-ink)] flex items-center gap-2">
              <Compass className="w-6 h-6 text-[var(--color-ink)]" />
              Daftar Trip Kamu ({trips.length})
            </h3>
          </div>

          {tripsQuery.isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-48 bg-[var(--color-ink)]/5 rounded-[22px] animate-pulse border-2 border-dashed border-[var(--color-ink)]/20"
                />
              ))}
            </div>
          ) : trips.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative p-8 md:p-12 text-center bg-white/40 rounded-[24px] border-2 border-dashed border-[var(--color-ink)]/30 max-w-md mx-auto my-8"
            >
              <Compass className="w-10 h-10 text-[var(--color-ink-soft)] mx-auto mb-3" />
              <h4 className="font-display text-2xl text-[var(--color-ink)] mb-2">
                Belum Ada Trip
              </h4>
              <p className="text-xs text-[var(--color-ink-soft)] mb-6">
                Kamu belum membuat trip perjalanan apapun. Mulai perjalanan barumu sekarang!
              </p>
              <Button variant="primary" onClick={() => setIsModalOpen(true)} roughSeed={22}>
                <Plus className="w-4 h-4" />
                Buat Trip Pertama
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip, idx) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  index={idx}
                  onInvite={(t) => setSelectedTripToInvite(t)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modals */}
      <CreateTripModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <InviteMemberModal
        isOpen={!!selectedTripToInvite}
        onClose={() => setSelectedTripToInvite(null)}
        trip={selectedTripToInvite}
      />
    </PageTransition>
  );
}
