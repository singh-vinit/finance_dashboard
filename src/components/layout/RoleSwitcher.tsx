"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFinanceStore } from "@/store/useFinanceStore";
import { roles, type UserRole } from "@/types";

const labels: Record<UserRole, string> = {
  admin: "Admin",
  viewer: "Viewer",
};

export function RoleSwitcher() {
  const role = useFinanceStore((state) => state.role);
  const setRole = useFinanceStore((state) => state.setRole);

  return (
    <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
      <SelectTrigger className="panel-soft w-full min-w-40 border-none shadow-none md:w-40">
        <SelectValue placeholder="Switch role" />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectGroup>
          {roles.map((item) => (
            <SelectItem key={item} value={item}>
              {labels[item]}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
