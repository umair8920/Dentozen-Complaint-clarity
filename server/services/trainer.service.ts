import { TrainerScheduleModel } from "../models/TrainerSchedule";
import { UserBookingModel } from "../models/UserBooking";
import type { PublicUser } from "../models/User";

function requireTrainer(user: PublicUser) {
  if (user.role !== "trainer") {
    throw new Error("Trainer dashboard access is required.");
  }
  if (user.status !== "active") {
    throw new Error("Your trainer account is inactive.");
  }
}

export const TrainerService = {
  async dashboard(user: PublicUser) {
    requireTrainer(user);

    const [appointments, availability] = await Promise.all([
      UserBookingModel.listByTrainer(user.id),
      TrainerScheduleModel.getAvailability(user.id),
    ]);

    return { appointments, availability };
  },

  async setWorkingDay(input: { user: PublicUser; weekday: number; isWorking: boolean }) {
    requireTrainer(input.user);
    return TrainerScheduleModel.setRule({
      trainerId: input.user.id,
      weekday: input.weekday,
      isWorking: input.isWorking,
    });
  },

  async createSlot(input: {
    user: PublicUser;
    weekday: number;
    startTime: string;
    endTime: string;
  }) {
    requireTrainer(input.user);
    return TrainerScheduleModel.createSlot({
      trainerId: input.user.id,
      weekday: input.weekday,
      startTime: input.startTime,
      endTime: input.endTime,
    });
  },

  async deleteSlot(input: { user: PublicUser; slotId: string }) {
    requireTrainer(input.user);
    const deleted = await TrainerScheduleModel.deleteSlot({
      trainerId: input.user.id,
      slotId: input.slotId,
    });
    if (!deleted) {
      throw new Error("Slot could not be found.");
    }
    return { ok: true };
  },

  async updateSlot(input: {
    user: PublicUser;
    slotId: string;
    startTime: string;
    endTime: string;
  }) {
    requireTrainer(input.user);
    return TrainerScheduleModel.updateSlot({
      trainerId: input.user.id,
      slotId: input.slotId,
      startTime: input.startTime,
      endTime: input.endTime,
    });
  },

  async createHoliday(input: { user: PublicUser; date: string; note?: string }) {
    requireTrainer(input.user);
    return TrainerScheduleModel.createHoliday({
      trainerId: input.user.id,
      date: input.date,
      note: input.note,
    });
  },

  async deleteHoliday(input: { user: PublicUser; holidayId: string }) {
    requireTrainer(input.user);
    const deleted = await TrainerScheduleModel.deleteHoliday({
      trainerId: input.user.id,
      holidayId: input.holidayId,
    });
    if (!deleted) {
      throw new Error("Holiday could not be found.");
    }
    return { ok: true };
  },

  async createSlotException(input: {
    user: PublicUser;
    slotId: string;
    date: string;
    reason?: string;
  }) {
    requireTrainer(input.user);
    return TrainerScheduleModel.createSlotException({
      trainerId: input.user.id,
      slotId: input.slotId,
      date: input.date,
      reason: input.reason,
    });
  },

  async deleteSlotException(input: { user: PublicUser; exceptionId: string }) {
    requireTrainer(input.user);
    const deleted = await TrainerScheduleModel.deleteSlotException({
      trainerId: input.user.id,
      exceptionId: input.exceptionId,
    });
    if (!deleted) {
      throw new Error("Slot exception could not be found.");
    }
    return { ok: true };
  },
};
