import { getCookie } from "@tanstack/start-server-core";

import { getEnv } from "../config/env";
import { getUserFromToken } from "../services/auth.service";

const roleContent = {
  admin: {
    title: "Admin Dashboard",
    subtitle: "System-wide compliance oversight and user management.",
    stats: [
      { label: "Practices monitored", value: "24" },
      { label: "Open actions", value: "18" },
      { label: "Trainer sessions", value: "9" },
    ],
    tasks: [
      "Review new user accounts",
      "Assign trainers to active practices",
      "Audit overdue CQC tasks",
    ],
  },
  trainer: {
    title: "Trainer Dashboard",
    subtitle: "Training delivery, certificates, and upcoming compliance visits.",
    stats: [
      { label: "Sessions this month", value: "12" },
      { label: "Certificates due", value: "7" },
      { label: "Practice visits", value: "5" },
    ],
    tasks: ["Upload BLS certificates", "Confirm cross infection attendance", "Prepare visit notes"],
  },
  user: {
    title: "Practice Dashboard",
    subtitle: "Your compliance actions, bookings, certificates, and next steps.",
    stats: [
      { label: "Certificates filed", value: "14" },
      { label: "Upcoming bookings", value: "2" },
      { label: "Actions due", value: "4" },
    ],
    tasks: [
      "Book fire risk assessment",
      "Upload latest staff training record",
      "Check CQC action plan",
    ],
  },
} as const;

export const DashboardController = {
  async getDashboard() {
    const user = await getUserFromToken(getCookie(getEnv().authCookieName));
    if (!user) {
      return { user: null, dashboard: null };
    }

    return {
      user,
      dashboard: roleContent[user.role],
    };
  },
};
