import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { registerSchema, type RegisterFormData } from "../types/auth.types";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { PencilBorder } from "../../../components/ui/PencilBorder";
import { UserAddIcon as UserPlus, NavigationIcon as Compass } from "react-doodle-icons";

export function RegisterForm() {
  const { registerMutation } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  const errorMessage = registerMutation.error
    ? (registerMutation.error as any).response?.data?.message || "Registrasi gagal. Silakan coba lagi."
    : null;

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative w-full max-w-md bg-[var(--color-cream)] p-6 md:p-8 rounded-[24px] shadow-[6px_8px_0px_0px_rgba(162,210,255,0.5)]"
    >
      <PencilBorder color="var(--color-ink)" roughness={1.8} seed={14} strokeWidth={2.5} />

      <div className="relative z-10 text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--color-blue)] text-[var(--color-ink)] mb-3 border-2 border-[var(--color-ink)] transform rotate-3">
          <Compass className="w-6 h-6" />
        </div>
        <h2 className="font-display text-3xl md:text-4xl text-[var(--color-ink)] tracking-wide">
          Buat Akun Barumu
        </h2>
        <p className="text-xs font-medium text-[var(--color-ink-soft)] mt-1">
          Mulai catat & buat buku itinerary perjalanan impianmu.
        </p>
      </div>

      {errorMessage && (
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: [0, -8, 8, -4, 4, 0], opacity: 1 }}
          className="mb-4 p-3 bg-red-100/80 border-2 border-red-400 text-red-700 text-xs font-semibold rounded-xl text-center"
        >
          {errorMessage}
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 flex flex-col gap-3">
        <Input
          label="Username"
          placeholder="misal: farhan_traveler"
          {...register("username")}
          error={errors.username?.message}
          roughSeed={5}
        />

        <Input
          label="Email"
          type="email"
          placeholder="nama@email.com"
          {...register("email")}
          error={errors.email?.message}
          roughSeed={6}
        />

        <Input
          label="Nama Lengkap (Opsional)"
          placeholder="Farhan Saputra"
          {...register("full_name")}
          error={errors.full_name?.message}
          roughSeed={7}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Minimal 6 karakter"
          {...register("password")}
          error={errors.password?.message}
          roughSeed={8}
        />

        <Button
          type="submit"
          variant="secondary"
          size="lg"
          isLoading={registerMutation.isPending}
          className="w-full mt-2"
          roughSeed={11}
        >
          <UserPlus className="w-4 h-4" />
          Daftar Sekarang
        </Button>

        <div className="text-center mt-3 text-xs font-medium text-[var(--color-ink-soft)]">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="font-bold text-[var(--color-ink)] hover:underline underline-offset-4 decoration-[var(--color-blue)] decoration-2"
          >
            Masuk Di Sini
          </Link>
        </div>
      </form>
    </motion.div>
  );
}
