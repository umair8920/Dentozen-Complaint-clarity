import { createServerFn } from "@tanstack/react-start";

export const getDashboard = createServerFn({ method: "GET" }).handler(async () => {
  const { DashboardController } = await import("../../../server/controllers/dashboard.controller");
  return DashboardController.getDashboard();
});
