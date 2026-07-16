import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const roleSchema = z.enum(["admin", "trainer", "user"]);
const statusSchema = z.enum(["active", "inactive"]);
const serviceSectionSchema = z.enum([
  "pricing",
  "build-your-package",
  "packages",
  "package-comparison",
]);
const serviceItemStatusSchema = z.enum(["active", "draft"]);

export const adminUsersQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(15).default(15),
  search: z.string().trim().max(120).optional().or(z.literal("")),
  role: z.enum(["all", "admin", "trainer", "user"]).default("all"),
  status: z.enum(["all", "active", "inactive"]).default("all"),
});

export type AdminUsersQueryInput = z.infer<typeof adminUsersQuerySchema>;

export const inviteUserSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").max(255),
  role: roleSchema,
});

export const updateUserRoleSchema = z.object({
  userId: z.string().uuid(),
  role: roleSchema,
});

export const updateUserStatusSchema = z.object({
  userId: z.string().uuid(),
  status: statusSchema,
});

export const resendInviteSchema = z.object({
  userId: z.string().uuid(),
});

export const serviceItemsQuerySchema = z.object({
  section: serviceSectionSchema.optional(),
});

export const serviceItemSchema = z.object({
  section: serviceSectionSchema,
  title: z.string().trim().min(1, "Title is required.").max(180),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  price: z.number().min(0).nullable().optional(),
  status: serviceItemStatusSchema.default("active"),
  displayOrder: z.number().int().min(0).default(0),
  metadataJson: z.string().default("{}"),
});

export const updateServiceItemSchema = serviceItemSchema.omit({ section: true }).extend({
  id: z.string().uuid(),
});

export const deleteServiceItemSchema = z.object({
  id: z.string().uuid(),
});

export const serviceCategorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required.").max(120),
  displayOrder: z.number().int().min(0).default(0),
  pricingNote: z.string().trim().max(500).optional().or(z.literal("")),
  builderNote: z.string().trim().max(500).optional().or(z.literal("")),
});

export const updateServiceCategorySchema = serviceCategorySchema.extend({
  id: z.string().uuid(),
});

export const deleteServiceCategorySchema = z.object({
  id: z.string().uuid(),
});

export type ServiceSectionInput = z.infer<typeof serviceSectionSchema>;

export const getAdminOverview = createServerFn({ method: "GET" }).handler(async () => {
  const { AdminController } = await import("../../../server/controllers/admin.controller");
  return AdminController.overview();
});

export const getAdminUsers = createServerFn({ method: "POST" })
  .validator(adminUsersQuerySchema)
  .handler(async ({ data }) => {
    const { AdminController } = await import("../../../server/controllers/admin.controller");
    return AdminController.users(data);
  });

export const inviteAdminUser = createServerFn({ method: "POST" })
  .validator(inviteUserSchema)
  .handler(async ({ data }) => {
    const { AdminController } = await import("../../../server/controllers/admin.controller");
    return AdminController.invite(data);
  });

export const updateAdminUserRole = createServerFn({ method: "POST" })
  .validator(updateUserRoleSchema)
  .handler(async ({ data }) => {
    const { AdminController } = await import("../../../server/controllers/admin.controller");
    return AdminController.updateRole(data);
  });

export const updateAdminUserStatus = createServerFn({ method: "POST" })
  .validator(updateUserStatusSchema)
  .handler(async ({ data }) => {
    const { AdminController } = await import("../../../server/controllers/admin.controller");
    return AdminController.updateStatus(data);
  });

export const resendAdminInvite = createServerFn({ method: "POST" })
  .validator(resendInviteSchema)
  .handler(async ({ data }) => {
    const { AdminController } = await import("../../../server/controllers/admin.controller");
    return AdminController.resendInvite(data);
  });

export const getAdminServiceItems = createServerFn({ method: "POST" })
  .validator(serviceItemsQuerySchema)
  .handler(async ({ data }) => {
    const { AdminController } = await import("../../../server/controllers/admin.controller");
    return AdminController.serviceItems(data);
  });

export const createAdminServiceItem = createServerFn({ method: "POST" })
  .validator(serviceItemSchema)
  .handler(async ({ data }) => {
    const { AdminController } = await import("../../../server/controllers/admin.controller");
    return AdminController.createServiceItem(data);
  });

export const updateAdminServiceItem = createServerFn({ method: "POST" })
  .validator(updateServiceItemSchema)
  .handler(async ({ data }) => {
    const { AdminController } = await import("../../../server/controllers/admin.controller");
    return AdminController.updateServiceItem(data);
  });

export const deleteAdminServiceItem = createServerFn({ method: "POST" })
  .validator(deleteServiceItemSchema)
  .handler(async ({ data }) => {
    const { AdminController } = await import("../../../server/controllers/admin.controller");
    return AdminController.deleteServiceItem(data);
  });

export const createAdminServiceCategory = createServerFn({ method: "POST" })
  .validator(serviceCategorySchema)
  .handler(async ({ data }) => {
    const { AdminController } = await import("../../../server/controllers/admin.controller");
    return AdminController.createServiceCategory(data);
  });

export const updateAdminServiceCategory = createServerFn({ method: "POST" })
  .validator(updateServiceCategorySchema)
  .handler(async ({ data }) => {
    const { AdminController } = await import("../../../server/controllers/admin.controller");
    return AdminController.updateServiceCategory(data);
  });

export const deleteAdminServiceCategory = createServerFn({ method: "POST" })
  .validator(deleteServiceCategorySchema)
  .handler(async ({ data }) => {
    const { AdminController } = await import("../../../server/controllers/admin.controller");
    return AdminController.deleteServiceCategory(data);
  });
