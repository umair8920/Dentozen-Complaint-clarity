import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const serviceSectionSchema = z.enum(["services", "pricing", "build-your-package", "packages"]);

export const getPublicServiceItems = createServerFn({ method: "POST" })
  .validator(z.object({ section: serviceSectionSchema }))
  .handler(async ({ data }) => {
    const { ServiceContentService } =
      await import("../../../server/services/service-content.service");
    return { items: await ServiceContentService.listPublic(data.section) };
  });
