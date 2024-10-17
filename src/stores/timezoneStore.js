import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTimezoneStore = create(
  persist(
    (set) => ({
      timezone: "IST", // Default timezone  
      setTimezone: (newTimezone) => set({ timezone: newTimezone }),
    }),
    {
      name: "timezone-storage",
    }
  )
);
