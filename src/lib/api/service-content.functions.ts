import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const serviceSectionSchema = z.enum([
  "pricing",
  "build-your-package",
  "packages",
  "package-comparison",
]);

export const getPublicServiceItems = createServerFn({ method: "POST" })
  .validator(z.object({ section: serviceSectionSchema }))
  .handler(async ({ data }) => {
    const { ServiceContentService } =
      await import("../../../server/services/service-content.service");
    return ServiceContentService.listPublic(data.section);
  });
