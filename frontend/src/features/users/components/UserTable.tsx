import { motion } from "framer-motion";
import type { AdminUser } from "../types/users.types";
import { PencilBorder } from "../../../components/ui/PencilBorder";
import { ShieldIcon as ShieldCheck, UserIcon, PencilIcon as Edit, DeleteIcon as Trash2, TickIcon as CheckCircle2, CrossIcon as XCircle } from "react-doodle-icons";
import { Button } from "../../../components/ui/Button";

interface UserTableProps {
  users: AdminUser[];
  onEdit: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
  isDeleting?: boolean;
}

export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  return (
    <div className="relative w-full bg-[var(--color-cream)] p-4 md:p-6 rounded-[24px] shadow-[6px_8px_0px_0px_rgba(58,50,56,0.15)] overflow-hidden">
      <PencilBorder color="var(--color-ink)" roughness={1.5} seed={17} strokeWidth={2} />

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto relative z-10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-[var(--color-ink)]/20 text-xs font-bold uppercase text-[var(--color-ink)] tracking-wider">
              <th className="py-3 px-4">Pengguna</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-ink)]/10 text-sm">
            {users.map((user, idx) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="hover:bg-black/5 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[var(--color-blue)]/30 border border-[var(--color-ink)] flex items-center justify-center font-bold text-xs">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-[var(--color-ink)]">{user.username}</div>
                      {user.full_name && (
                        <div className="text-xs text-[var(--color-ink-soft)]">{user.full_name}</div>
                      )}
                    </div>
                  </div>
                </td>

                <td className="py-3 px-4 text-[var(--color-ink-soft)] font-medium">
                  {user.email}
                </td>

                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border border-[var(--color-ink)] ${
                      user.role === "admin"
                        ? "bg-[var(--color-pink)] text-[var(--color-ink)]"
                        : "bg-[var(--color-blue)] text-[var(--color-ink)]"
                    }`}
                  >
                    {user.role === "admin" ? <ShieldCheck className="w-3.5 h-3.5" /> : <UserIcon className="w-3.5 h-3.5" />}
                    {user.role.toUpperCase()}
                  </span>
                </td>

                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${
                      user.is_active ? "text-emerald-700 bg-emerald-100" : "text-red-700 bg-red-100"
                    }`}
                  >
                    {user.is_active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {user.is_active ? "Aktif" : "Non-Aktif"}
                  </span>
                </td>

                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(user)}
                      roughSeed={idx + 2}
                      className="px-2.5 py-1 text-xs min-h-[34px]"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDelete(user)}
                      className="px-2.5 py-1 text-xs min-h-[34px]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="md:hidden flex flex-col gap-3 relative z-10">
        {users.map((user, idx) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-4 bg-white/60 rounded-[18px] border border-[var(--color-ink)]/20 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--color-blue)]/30 border border-[var(--color-ink)] flex items-center justify-center font-bold text-xs">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-[var(--color-ink)] text-sm">{user.username}</div>
                  <div className="text-xs text-[var(--color-ink-soft)]">{user.email}</div>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border border-[var(--color-ink)] ${
                  user.role === "admin" ? "bg-[var(--color-pink)]" : "bg-[var(--color-blue)]"
                }`}
              >
                {user.role.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--color-ink)]/10 text-xs">
              <span className={user.is_active ? "text-emerald-700 font-semibold" : "text-red-700 font-semibold"}>
                {user.is_active ? "● Aktif" : "● Non-Aktif"}
              </span>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(user)} className="px-3 py-1 text-xs min-h-[36px]">
                  <Edit className="w-3.5 h-3.5" /> Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => onDelete(user)} className="px-3 py-1 text-xs min-h-[36px]">
                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
