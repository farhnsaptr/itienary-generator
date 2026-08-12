import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "../components/layout/Navbar";
import { PageTransition } from "../components/layout/PageTransition";
import { useUsers, UserTable, UserFormModal } from "../features/users";
import type { AdminUser, CreateUserFormData, UpdateUserFormData } from "../features/users";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { PencilBorder } from "../components/ui/PencilBorder";
import { ShieldIcon as ShieldCheck, UserAddIcon as UserPlus, SearchIcon as Search } from "react-doodle-icons";

export function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<AdminUser | null>(null);

  const { usersQuery, createUserMutation, updateUserMutation, deleteUserMutation } = useUsers(search);

  const users = usersQuery.data?.data || [];

  const handleOpenCreate = () => {
    setUserToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: AdminUser) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  const handleDelete = (user: AdminUser) => {
    if (confirm(`Apakah Anda yakin ingin menghapus pengguna "${user.username}"?`)) {
      deleteUserMutation.mutate(user.id);
    }
  };

  const handleFormSubmit = (formData: CreateUserFormData | UpdateUserFormData) => {
    if (userToEdit) {
      updateUserMutation.mutate(
        { id: userToEdit.id, data: formData },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setUserToEdit(null);
          },
        }
      );
    } else {
      createUserMutation.mutate(formData as CreateUserFormData, {
        onSuccess: () => {
          setIsModalOpen(false);
        },
      });
    }
  };

  const isSubmitting = createUserMutation.isPending || updateUserMutation.isPending;
  const formError = (createUserMutation.error as any)?.response?.data?.message || (updateUserMutation.error as any)?.response?.data?.message;

  return (
    <PageTransition className="min-h-screen bg-[var(--color-cream)] pb-12">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4">
        {/* Banner Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-[var(--color-blue)]/20 p-6 md:p-8 rounded-[24px] mb-8 text-left border border-[var(--color-ink)]/10"
        >
          <PencilBorder color="var(--color-ink)" roughness={1.6} seed={11} />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--color-pink)] text-[var(--color-ink)] rounded-full text-xs font-bold border border-[var(--color-ink)] mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                Panel Admin
              </div>
              <h2 className="font-display text-3xl md:text-5xl text-[var(--color-ink)] leading-none mb-2">
                Manajemen Pengguna
              </h2>
              <p className="text-xs md:text-sm text-[var(--color-ink-soft)] font-normal max-w-xl">
                Tambah, ubah role/status, atau hapus akses pengguna dalam sistem.
              </p>
            </div>

            <div>
              <Button
                variant="primary"
                size="lg"
                onClick={handleOpenCreate}
                roughSeed={21}
                className="w-full md:w-auto shadow-[4px_6px_0px_0px_rgba(58,50,56,0.3)]"
              >
                <UserPlus className="w-5 h-5" />
                Tambah User Baru
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="w-full md:w-80">
            <div className="relative">
              <Input
                placeholder="Cari username / email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                roughSeed={30}
                className="pl-10"
              />
              <Search className="w-4 h-4 text-[var(--color-ink-soft)] absolute left-3 top-3.5 z-20" />
            </div>
          </div>

          <div className="text-xs font-semibold text-[var(--color-ink-soft)]">
            Total Pengguna: <span className="text-[var(--color-ink)] font-bold">{usersQuery.data?.pagination.total || 0}</span>
          </div>
        </div>

        {/* User Table Component */}
        {usersQuery.isLoading ? (
          <div className="h-64 bg-white/40 rounded-[24px] border-2 border-dashed border-[var(--color-ink)]/20 animate-pulse flex items-center justify-center font-display text-xl">
            Memuat Data Pengguna...
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center bg-white/40 rounded-[24px] border-2 border-dashed border-[var(--color-ink)]/30">
            <div className="text-sm font-semibold text-[var(--color-ink-soft)]">
              Tidak ada pengguna yang cocok dengan kata kunci pencarian.
            </div>
          </div>
        ) : (
          <UserTable
            users={users}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            isDeleting={deleteUserMutation.isPending}
          />
        )}
      </main>

      {/* Create / Edit Form Modal */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        userToEdit={userToEdit}
        isLoading={isSubmitting}
        error={formError}
      />
    </PageTransition>
  );
}
