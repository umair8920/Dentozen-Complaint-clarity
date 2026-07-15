import { getCookie, getRequestUrl } from "@tanstack/start-server-core";

import { getEnv } from "../config/env";
import { getUserFromToken } from "../services/auth.service";
import { AdminService } from "../services/admin.service";
import { ServiceContentService } from "../services/service-content.service";

async function requireAdmin() {
  const user = await getUserFromToken(getCookie(getEnv().authCookieName));
  if (!user) {
    throw new Error("Authentication required.");
  }

  if (user.role !== "admin") {
    throw new Error("Admin access required.");
  }

  return user;
}

export const AdminController = {
  async overview() {
    const admin = await requireAdmin();
    return { admin, ...(await AdminService.getOverview()) };
  },

  async users(input: {
    page: number;
    pageSize: number;
    search?: string;
    role?: "admin" | "trainer" | "user" | "all";
    status?: "active" | "inactive" | "all";
  }) {
    await requireAdmin();
    return AdminService.listUsers(input);
  },

  async updateStatus(input: { userId: string; status: "active" | "inactive" }) {
    await requireAdmin();
    return { user: await AdminService.updateUserStatus(input) };
  },

  async updateRole(input: { userId: string; role: "admin" | "trainer" | "user" }) {
    await requireAdmin();
    return { user: await AdminService.updateUserRole(input) };
  },

  async invite(input: { email: string; role: "admin" | "trainer" | "user" }) {
    await requireAdmin();
    const requestUrl = getRequestUrl();
    return {
      user: await AdminService.inviteUser({
        ...input,
        origin: `${requestUrl.protocol}//${requestUrl.host}`,
      }),
    };
  },

  async resendInvite(input: { userId: string }) {
    await requireAdmin();
    const requestUrl = getRequestUrl();
    return {
      user: await AdminService.resendInvite({
        userId: input.userId,
        origin: `${requestUrl.protocol}//${requestUrl.host}`,
      }),
    };
  },

  async serviceItems(input: {
    section?: "services" | "pricing" | "build-your-package" | "packages";
  }) {
    await requireAdmin();
    return ServiceContentService.list(input.section);
  },

  async createServiceItem(input: {
    section: "services" | "pricing" | "build-your-package" | "packages";
    title: string;
    description?: string;
    price?: number | null;
    status?: "active" | "draft";
    displayOrder?: number;
    metadataJson?: string;
  }) {
    await requireAdmin();
    return { item: await ServiceContentService.create(input) };
  },

  async updateServiceItem(input: {
    id: string;
    title: string;
    description?: string;
    price?: number | null;
    status?: "active" | "draft";
    displayOrder?: number;
    metadataJson?: string;
  }) {
    await requireAdmin();
    const { id, ...data } = input;
    return { item: await ServiceContentService.update(id, data) };
  },

  async deleteServiceItem(input: { id: string }) {
    await requireAdmin();
    return { item: await ServiceContentService.delete(input.id) };
  },
};
