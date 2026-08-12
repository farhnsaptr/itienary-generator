import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Navbar } from "../components/layout/Navbar";
import { PageTransition } from "../components/layout/PageTransition";
import { tripsService } from "../features/trips/services/tripsService";
import {
  useActivities,
  ActivityTimeline,
  CreateActivityModal,
  EditActivityModal,
  DownloadZipModal,
  UploadPhotoModal,
  PolaroidGalleryModal,
  type Activity,
  type ActivityPhotoItem,
} from "../features/activities";
import { Button } from "../components/ui/Button";
import { PencilBorder } from "../components/ui/PencilBorder";
import {
  ArrowLeftIcon as ArrowLeft,
  CalendarIcon as Calendar,
  NavigationIcon as Compass,
  DocAddIcon as Plus,
} from "react-doodle-icons";

export function TripDetailPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const [selectedDateFilter, setSelectedDateFilter] = useState<string | undefined>(undefined);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [targetPhotoActivity, setTargetPhotoActivity] = useState<Activity | null>(null);
  const [zipTargetActivity, setZipTargetActivity] = useState<Activity | null>(null);
  const [galleryState, setGalleryState] = useState<{
    isOpen: boolean;
    activity: Activity | null;
    photos: ActivityPhotoItem[];
  }>({
    isOpen: false,
    activity: null,
    photos: [],
  });

  // Query trip info
  const tripQuery = useQuery({
    queryKey: ["trip", tripId],
    queryFn: () => tripsService.getTrips().then((trips) => trips.find((t) => t.id === tripId)),
    enabled: !!tripId,
  });

  const trip = tripQuery.data;

  // Query activities
  const {
    activitiesQuery,
    createActivityMutation,
    updateActivityMutation,
    deleteActivityMutation,
    uploadPhotoMutation,
    deletePhotoMutation,
  } = useActivities(tripId || "", selectedDateFilter);

  const activities = activitiesQuery.data || [];

  // Calculate day list from trip start_date to end_date
  const dateDays = useMemo(() => {
    if (!trip?.start_date || !trip?.end_date) return [];
    const days: { dateStr: string; label: string }[] = [];
    const current = new Date(trip.start_date);
    const end = new Date(trip.end_date);

    let count = 1;
    while (current <= end) {
      const dateStr = current.toISOString().split("T")[0];
      days.push({
        dateStr,
        label: `Hari ${count} (${current.toLocaleDateString("id-ID", { day: "numeric", month: "short" })})`,
      });
      current.setDate(current.getDate() + 1);
      count++;
    }
    return days;
  }, [trip?.start_date, trip?.end_date]);

  if (tripQuery.isLoading) {
    return (
      <PageTransition className="min-h-screen bg-[var(--color-cream)] pb-12">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 pt-12 text-center">
          <div className="h-48 bg-white/50 rounded-[24px] animate-pulse border-2 border-dashed border-[var(--color-ink)]/20" />
        </div>
      </PageTransition>
    );
  }

  if (!trip) {
    return (
      <PageTransition className="min-h-screen bg-[var(--color-cream)] pb-12">
        <Navbar />
        <div className="max-w-md mx-auto px-4 pt-12 text-center">
          <h2 className="font-display text-3xl text-[var(--color-ink)] mb-3">Trip Tidak Ditemukan</h2>
          <p className="text-xs text-[var(--color-ink-soft)] mb-6">
            Trip ini mungkin telah dihapus atau Anda tidak memiliki hak akses.
          </p>
          <Link to="/dashboard">
            <Button variant="primary">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
            </Button>
          </Link>
        </div>
      </PageTransition>
    );
  }

  const canManageActivities = trip.my_role === "owner" || trip.can_manage_activities;
  const canManagePhotos = trip.my_role === "owner" || trip.can_manage_photos;

  return (
    <PageTransition className="min-h-screen bg-[var(--color-cream)] pb-12">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 text-left">
        {/* Back Link */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-ink)] hover:underline mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Trip
        </Link>

        {/* Trip Header Scrapbook Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative p-6 md:p-8 rounded-[26px] bg-[var(--color-pink)]/20 border border-[var(--color-ink)]/10 shadow-[6px_8px_0px_0px_rgba(58,50,56,0.15)] mb-8"
        >
          <PencilBorder color="var(--color-ink)" roughness={1.6} seed={21} />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="font-display text-3xl md:text-5xl text-[var(--color-ink)] leading-none mb-2">
                {trip.name}
              </h1>

              {trip.description && (
                <p className="text-xs md:text-sm text-[var(--color-ink-soft)] font-normal max-w-xl mb-3">
                  {trip.description}
                </p>
              )}

              <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-ink)]">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(trip.start_date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  -{" "}
                  {new Date(trip.end_date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            {canManageActivities && (
              <div className="shrink-0">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setIsCreateModalOpen(true)}
                  roughSeed={35}
                  className="w-full md:w-auto shadow-[4px_5px_0px_0px_rgba(58,50,56,0.25)]"
                >
                  <Plus className="w-5 h-5" />
                  Tambah Activity
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Date Filter Tabs */}
        <section className="mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedDateFilter(undefined)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-2 cursor-pointer ${
                selectedDateFilter === undefined
                  ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)] shadow-xs"
                  : "bg-white text-[var(--color-ink)] border-gray-300 hover:border-gray-400"
              }`}
            >
              Semua Hari ({activities.length})
            </button>

            {dateDays.map((day) => (
              <button
                key={day.dateStr}
                type="button"
                onClick={() => setSelectedDateFilter(day.dateStr)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-2 whitespace-nowrap cursor-pointer ${
                  selectedDateFilter === day.dateStr
                    ? "bg-[var(--color-pink)] text-[var(--color-ink)] border-[var(--color-ink)] shadow-xs"
                    : "bg-white text-[var(--color-ink)] border-gray-300 hover:border-gray-400"
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </section>

        {/* Linear Activity Timeline Section */}
        <section className="relative min-h-[300px]">
          <div className="flex items-center justify-between mb-6 px-1">
            <h3 className="font-display text-2xl md:text-3xl text-[var(--color-ink)] flex items-center gap-2">
              <Compass className="w-6 h-6 text-[var(--color-ink)]" />
              Itinerary Timeline
            </h3>
          </div>

          {activitiesQuery.isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="h-36 bg-white/40 rounded-[22px] animate-pulse border-2 border-dashed border-[var(--color-ink)]/20" />
              ))}
            </div>
          ) : (
            <ActivityTimeline
              activities={activities}
              canManageActivities={canManageActivities}
              canManagePhotos={canManagePhotos}
              onEditActivity={(act) => setEditingActivity(act)}
              onDeleteActivity={(actId) => deleteActivityMutation.mutate(actId)}
              onAddPhoto={(act) => setTargetPhotoActivity(act)}
              onDownloadZip={(act) => setZipTargetActivity(act)}
              onOpenGallery={(act) =>
                setGalleryState({
                  isOpen: true,
                  activity: act,
                  photos: act.activity_photos || [],
                })
              }
            />
          )}
        </section>
      </main>

      {/* Modals */}
      <CreateActivityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        tripStartDate={trip.start_date}
        tripEndDate={trip.end_date}
        isSubmitting={createActivityMutation.isPending}
        onSubmit={async (data) => {
          await createActivityMutation.mutateAsync(data);
        }}
      />

      <EditActivityModal
        activity={editingActivity}
        onClose={() => setEditingActivity(null)}
        tripStartDate={trip.start_date}
        tripEndDate={trip.end_date}
        isSubmitting={updateActivityMutation.isPending}
        onSubmit={async (activityId, data) => {
          await updateActivityMutation.mutateAsync({ activityId, data });
        }}
      />

      <DownloadZipModal
        isOpen={!!zipTargetActivity}
        onClose={() => setZipTargetActivity(null)}
        activity={zipTargetActivity}
      />

      <UploadPhotoModal
        isOpen={!!targetPhotoActivity}
        onClose={() => setTargetPhotoActivity(null)}
        activityTitle={targetPhotoActivity?.title || ""}
        isUploading={uploadPhotoMutation.isPending}
        onUpload={async (file, caption) => {
          if (targetPhotoActivity) {
            await uploadPhotoMutation.mutateAsync({
              activityId: targetPhotoActivity.id,
              file,
              caption,
            });
          }
        }}
      />

      <PolaroidGalleryModal
        isOpen={galleryState.isOpen}
        onClose={() => setGalleryState({ isOpen: false, activity: null, photos: [] })}
        photos={galleryState.photos}
        activityTitle={galleryState.activity?.title || ""}
        canManagePhotos={canManagePhotos}
        onDeletePhoto={(photoId) => {
          deletePhotoMutation.mutate(photoId, {
            onSuccess: () => {
              setGalleryState((prev) => ({
                ...prev,
                photos: prev.photos.filter((p) => p.id !== photoId),
              }));
            },
          });
        }}
      />
    </PageTransition>
  );
}
