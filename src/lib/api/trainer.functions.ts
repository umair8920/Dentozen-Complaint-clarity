import { getCookie } from "@tanstack/start-server-core";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getEnv } from "../../../server/config/env";
import { getUserFromToken } from "../../../server/services/auth.service";

const weekdaySchema = z.number().int().min(0).max(6);
const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use HH:mm time.");

const workingDaySchema = z.object({
  weekday: weekdaySchema,
  isWorking: z.boolean(),
});

const slotSchema = z
  .object({
    weekday: weekdaySchema,
    startTime: timeSchema,
    endTime: timeSchema,
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "End time must be after start time.",
    path: ["endTime"],
  });

const slotIdSchema = z.object({
  slotId: z.string().uuid(),
});

const updateSlotSchema = z
  .object({
    slotId: z.string().uuid(),
    startTime: timeSchema,
    endTime: timeSchema,
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "End time must be after start time.",
    path: ["endTime"],
  });

const holidaySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD date."),
  note: z.string().trim().max(160).optional().or(z.literal("")),
});

const holidayIdSchema = z.object({
  holidayId: z.string().uuid(),
});

const slotExceptionSchema = z.object({
  slotId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD date."),
  reason: z.string().trim().max(160).optional().or(z.literal("")),
});

const slotExceptionIdSchema = z.object({
  exceptionId: z.string().uuid(),
});

async function requireTrainer() {
  const user = await getUserFromToken(getCookie(getEnv().authCookieName));
  if (!user) {
    throw new Error("Please login to continue.");
  }
  if (user.role !== "trainer") {
    throw new Error("Trainer dashboard access is required.");
  }
  return user;
}

export const getTrainerDashboard = createServerFn({ method: "GET" }).handler(async () => {
  const user = await requireTrainer();
  const { TrainerService } = await import("../../../server/services/trainer.service");
  return TrainerService.dashboard(user);
});

export const setTrainerWorkingDay = createServerFn({ method: "POST" })
  .validator(workingDaySchema)
  .handler(async ({ data }) => {
    const user = await requireTrainer();
    const { TrainerService } = await import("../../../server/services/trainer.service");
    return TrainerService.setWorkingDay({ user, ...data });
  });

export const createTrainerSlot = createServerFn({ method: "POST" })
  .validator(slotSchema)
  .handler(async ({ data }) => {
    const user = await requireTrainer();
    const { TrainerService } = await import("../../../server/services/trainer.service");
    return TrainerService.createSlot({ user, ...data });
  });

export const deleteTrainerSlot = createServerFn({ method: "POST" })
  .validator(slotIdSchema)
  .handler(async ({ data }) => {
    const user = await requireTrainer();
    const { TrainerService } = await import("../../../server/services/trainer.service");
    return TrainerService.deleteSlot({ user, slotId: data.slotId });
  });

export const updateTrainerSlot = createServerFn({ method: "POST" })
  .validator(updateSlotSchema)
  .handler(async ({ data }) => {
    const user = await requireTrainer();
    const { TrainerService } = await import("../../../server/services/trainer.service");
    return TrainerService.updateSlot({ user, ...data });
  });

export const createTrainerHoliday = createServerFn({ method: "POST" })
  .validator(holidaySchema)
  .handler(async ({ data }) => {
    const user = await requireTrainer();
    const { TrainerService } = await import("../../../server/services/trainer.service");
    return TrainerService.createHoliday({ user, date: data.date, note: data.note });
  });

export const deleteTrainerHoliday = createServerFn({ method: "POST" })
  .validator(holidayIdSchema)
  .handler(async ({ data }) => {
    const user = await requireTrainer();
    const { TrainerService } = await import("../../../server/services/trainer.service");
    return TrainerService.deleteHoliday({ user, holidayId: data.holidayId });
  });

export const createTrainerSlotException = createServerFn({ method: "POST" })
  .validator(slotExceptionSchema)
  .handler(async ({ data }) => {
    const user = await requireTrainer();
    const { TrainerService } = await import("../../../server/services/trainer.service");
    return TrainerService.createSlotException({
      user,
      slotId: data.slotId,
      date: data.date,
      reason: data.reason,
    });
  });

export const deleteTrainerSlotException = createServerFn({ method: "POST" })
  .validator(slotExceptionIdSchema)
  .handler(async ({ data }) => {
    const user = await requireTrainer();
    const { TrainerService } = await import("../../../server/services/trainer.service");
    return TrainerService.deleteSlotException({ user, exceptionId: data.exceptionId });
  });
