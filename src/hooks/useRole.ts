"use client";

import { useFinanceStore } from "@/store/useFinanceStore";

export function useRole() {
  const role = useFinanceStore((state) => state.role);

  return {
    role,
    isAdmin: role === "admin",
    isViewer: role === "viewer",
  };
}
