import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { loginSchema, type LoginFormData } from "../types/auth.types";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { PencilBorder } from "../../../components/ui/PencilBorder";
import { KeyIcon as KeyRound, StarIcon as Sparkles } from "react-doodle-icons";

export function LoginForm() {
  const { loginMutation } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const errorMessage = loginMutation.error
    ? (loginMutation.error as any).response?.data?.message || "Login gagal. Silakan periksa kredensial Anda."
    : null;

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative w-full max-w-md bg-[var(--color-cream)] p-6 md:p-8 rounded-[24px] shadow-[6px_8px_0px_0px_rgba(255,179,198,0.5)]"
    >
      <PencilBorder color="var(--color-ink)" roughness={1.8} seed={12} strokeWidth={2.5} />

      <div className="relative z-10 text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--color-pink)] text-[var(--color-ink)] mb-3 border-2 border-[var(--color-ink)] transform -rotate-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="font-display text-3xl md:text-4xl text-[var(--color-ink)] tracking-wide">
          Selamat Datang Kembali!
        </h2>
        <p className="text-xs font-medium text-[var(--color-ink-soft)] mt-1">
          Masuk ke akunmu dan lanjutkan rencana liburan serumu.
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

      <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 flex flex-col gap-4">
        <div>
          <Input
            label="Username / Email"
            placeholder="Masukkan username atau email"
            {...register("usernameOrEmail")}
            error={errors.usernameOrEmail?.message}
            roughSeed={3}
          />
        </div>

        <div>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            error={errors.password?.message}
            roughSeed={4}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={loginMutation.isPending}
          className="w-full mt-2"
          roughSeed={7}
        >
          <KeyRound className="w-4 h-4" />
          Masuk Sekarang
        </Button>
      </form>
    </motion.div>
  );
}
