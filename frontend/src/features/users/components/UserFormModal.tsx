import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import type { AdminUser, CreateUserFormData, UpdateUserFormData } from "../types/users.types";
import { createUserSchema } from "../types/users.types";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { PencilBorder } from "../../../components/ui/PencilBorder";
import { CrossIcon as X, UserAddIcon as UserPlus, UserIcon as UserCheck, ShieldIcon as ShieldCheck, UserIcon } from "react-doodle-icons";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserFormData | UpdateUserFormData) => void;
  userToEdit: AdminUser | null;
  isLoading?: boolean;
  error?: string | null;
}

export function UserFormModal({
  isOpen,
  onClose,
  onSubmit,
  userToEdit,
  isLoading = false,
  error = null,
}: UserFormModalProps) {
  const isEditing = !!userToEdit;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: isEditing ? undefined : zodResolver(createUserSchema),
    defaultValues: {
      role: "user",
      is_active: true,
    },
  });

  const selectedRole = watch("role");
  const isActive = watch("is_active");

  useEffect(() => {
    if (userToEdit) {
      reset({
        username: userToEdit.username,
        email: userToEdit.email,
        full_name: userToEdit.full_name || "",
        role: userToEdit.role,
        is_active: userToEdit.is_active,
        password: "",
      });
    } else {
      reset({
        username: "",
        email: "",
        password: "",
        full_name: "",
        role: "user",
        is_active: true,
      });
    }
  }, [userToEdit, reset, isOpen]);

  const handleFormSubmit = (data: any) => {
    onSubmit(data);
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
            className="fixed inset-0 bg-[var(--color-ink)]/40 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-[var(--color-cream)] p-6 md:p-8 rounded-[24px] shadow-[8px_10px_0px_0px_rgba(58,50,56,0.2)] z-10 max-h-[90vh] overflow-y-auto"
          >
            <PencilBorder color="var(--color-ink)" roughness={2} strokeWidth={3} seed={25} />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between mb-6 pb-3 border-b-2 border-[var(--color-ink)]/20">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[var(--color-pink)] rounded-xl border border-[var(--color-ink)] transform -rotate-3">
                  {isEditing ? <UserCheck className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                </div>
                <h2 className="font-display text-2xl md:text-3xl text-[var(--color-ink)]">
                  {isEditing ? "Edit Data Pengguna" : "Tambah Pengguna Baru"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-[var(--color-ink)] hover:bg-black/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border-2 border-red-400 text-red-700 text-xs font-semibold rounded-xl text-center">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(handleFormSubmit)} className="relative z-10 flex flex-col gap-3">
              <Input
                label="Username"
                placeholder="username_baru"
                {...register("username")}
                error={errors.username?.message as string | undefined}
                roughSeed={14}
              />

              <Input
                label="Email"
                type="email"
                placeholder="nama@email.com"
                {...register("email")}
                error={errors.email?.message as string | undefined}
                roughSeed={15}
              />

              <Input
                label={isEditing ? "Password Baru (Opsional)" : "Password"}
                type="password"
                placeholder={isEditing ? "Kosongkan jika tidak diubah" : "Minimal 6 karakter"}
                {...register("password")}
                error={errors.password?.message as string | undefined}
                roughSeed={16}
              />

              <Input
                label="Nama Lengkap (Opsional)"
                placeholder="Farhan Saputra"
                {...register("full_name")}
                error={errors.full_name?.message as string | undefined}
                roughSeed={17}
              />

              {/* Role Selection */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-semibold text-[var(--color-ink)] uppercase tracking-wide px-1">
                  Role Akses
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setValue("role", "user")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 font-semibold text-xs transition-colors ${
                      selectedRole === "user"
                        ? "bg-[var(--color-blue)] border-[var(--color-ink)] text-[var(--color-ink)]"
                        : "bg-white/50 border-gray-300 text-[var(--color-ink-soft)] hover:bg-white"
                    }`}
                  >
                    <UserIcon className="w-4 h-4" /> USER
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue("role", "admin")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 font-semibold text-xs transition-colors ${
                      selectedRole === "admin"
                        ? "bg-[var(--color-pink)] border-[var(--color-ink)] text-[var(--color-ink)]"
                        : "bg-white/50 border-gray-300 text-[var(--color-ink-soft)] hover:bg-white"
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" /> ADMIN
                  </button>
                </div>
              </div>

              {/* Status Toggle (For Edit) */}
              {isEditing && (
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-[var(--color-ink)]/20 mt-1">
                  <span className="text-xs font-semibold text-[var(--color-ink)] uppercase tracking-wide">
                    Status Akun: {isActive ? "Aktif" : "Non-Aktif"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setValue("is_active", !isActive)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg border border-[var(--color-ink)] transition-colors ${
                      isActive ? "bg-emerald-200 text-emerald-900" : "bg-red-200 text-red-900"
                    }`}
                  >
                    {isActive ? "Aktifkan" : "Non-Aktifkan"}
                  </button>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 mt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Batal
                </Button>
                <Button type="submit" variant="primary" isLoading={isLoading}>
                  {isEditing ? "Simpan Perubahan" : "Buat Pengguna"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
