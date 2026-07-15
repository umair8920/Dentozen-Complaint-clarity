import { query } from "../db/pool";

export type TrainerAssignmentRecord = {
  id: string;
  trainer_id: string;
  service_key: string;
  service_label: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
};

export type TrainerAvailabilityRuleRecord = {
  id: string;
  trainer_id: string;
  weekday: number;
  is_working: boolean;
  created_at: Date;
  updated_at: Date;
};

export type TrainerAvailabilitySlotRecord = {
  id: string;
  trainer_id: string;
  weekday: number;
  start_time: string;
  end_time: string;
  created_at: Date;
  updated_at: Date;
};

export type TrainerHolidayRecord = {
  id: string;
  trainer_id: string;
  holiday_date: string;
  note: string;
  created_at: Date;
};

export type TrainerSlotExceptionRecord = {
  id: string;
  trainer_id: string;
  slot_id: string;
  exception_date: string;
  reason: string;
  created_at: Date;
};

function toSlot(slot: TrainerAvailabilitySlotRecord) {
  return {
    id: slot.id,
    weekday: slot.weekday,
    startTime: slot.start_time.slice(0, 5),
    endTime: slot.end_time.slice(0, 5),
  };
}

function toRule(rule: TrainerAvailabilityRuleRecord) {
  return {
    id: rule.id,
    weekday: rule.weekday,
    isWorking: rule.is_working,
  };
}

function toHoliday(holiday: TrainerHolidayRecord) {
  return {
    id: holiday.id,
    date: holiday.holiday_date,
    note: holiday.note,
  };
}

function toSlotException(exception: TrainerSlotExceptionRecord) {
  return {
    id: exception.id,
    slotId: exception.slot_id,
    date: exception.exception_date,
    reason: exception.reason,
  };
}

export const TrainerScheduleModel = {
  async assignmentsForService(serviceKey: string) {
    const result = await query<TrainerAssignmentRecord>(
      `select trainer_service_assignments.*
       from trainer_service_assignments
       join users on users.id = trainer_service_assignments.trainer_id
       where trainer_service_assignments.service_key = $1
         and trainer_service_assignments.active = true
         and users.role = 'trainer'
         and users.status = 'active'`,
      [serviceKey],
    );
    return result.rows;
  },

  async listAssignments(trainerId: string) {
    const result = await query<TrainerAssignmentRecord>(
      `select * from trainer_service_assignments
       where trainer_id = $1
       order by service_label asc`,
      [trainerId],
    );
    return result.rows.map((assignment) => ({
      id: assignment.id,
      serviceKey: assignment.service_key,
      serviceLabel: assignment.service_label,
      active: assignment.active,
    }));
  },

  async ensureDefaultAvailability(trainerId: string) {
    for (let weekday = 0; weekday <= 6; weekday += 1) {
      const isWorking = weekday >= 1 && weekday <= 5;
      await query(
        `insert into trainer_availability_rules (trainer_id, weekday, is_working)
         values ($1, $2, $3)
         on conflict (trainer_id, weekday) do nothing`,
        [trainerId, weekday, isWorking],
      );
    }
  },

  async getAvailability(trainerId: string) {
    await this.ensureDefaultAvailability(trainerId);

    const [rules, slots, holidays, exceptions, assignments] = await Promise.all([
      query<TrainerAvailabilityRuleRecord>(
        `select * from trainer_availability_rules
         where trainer_id = $1
         order by weekday asc`,
        [trainerId],
      ),
      query<TrainerAvailabilitySlotRecord>(
        `select * from trainer_availability_slots
         where trainer_id = $1
         order by weekday asc, start_time asc`,
        [trainerId],
      ),
      query<TrainerHolidayRecord>(
        `select id, trainer_id, holiday_date::text, note, created_at
         from trainer_holidays
         where trainer_id = $1
         order by holiday_date asc`,
        [trainerId],
      ),
      query<TrainerSlotExceptionRecord>(
        `select id, trainer_id, slot_id, exception_date::text, reason, created_at
         from trainer_slot_exceptions
         where trainer_id = $1
         order by exception_date asc, created_at asc`,
        [trainerId],
      ),
      this.listAssignments(trainerId),
    ]);

    return {
      rules: rules.rows.map(toRule),
      slots: slots.rows.map(toSlot),
      holidays: holidays.rows.map(toHoliday),
      exceptions: exceptions.rows.map(toSlotException),
      assignments,
    };
  },

  async setRule(input: { trainerId: string; weekday: number; isWorking: boolean }) {
    const result = await query<TrainerAvailabilityRuleRecord>(
      `insert into trainer_availability_rules (trainer_id, weekday, is_working)
       values ($1, $2, $3)
       on conflict (trainer_id, weekday)
       do update set is_working = excluded.is_working, updated_at = now()
       returning *`,
      [input.trainerId, input.weekday, input.isWorking],
    );
    return toRule(result.rows[0]);
  },

  async createSlot(input: {
    trainerId: string;
    weekday: number;
    startTime: string;
    endTime: string;
  }) {
    const overlapping = await query<{ id: string }>(
      `select id
       from trainer_availability_slots
       where trainer_id = $1
         and weekday = $2
         and start_time < $4::time
         and end_time > $3::time
       limit 1`,
      [input.trainerId, input.weekday, input.startTime, input.endTime],
    );
    if (overlapping.rows[0]) {
      throw new Error("This slot overlaps an existing slot for the selected day.");
    }

    const result = await query<TrainerAvailabilitySlotRecord>(
      `insert into trainer_availability_slots (trainer_id, weekday, start_time, end_time)
       values ($1, $2, $3::time, $4::time)
       returning *`,
      [input.trainerId, input.weekday, input.startTime, input.endTime],
    );
    return toSlot(result.rows[0]);
  },

  async deleteSlot(input: { trainerId: string; slotId: string }) {
    const result = await query<TrainerAvailabilitySlotRecord>(
      `delete from trainer_availability_slots
       where id = $1 and trainer_id = $2
       returning *`,
      [input.slotId, input.trainerId],
    );
    return result.rows[0] ? toSlot(result.rows[0]) : null;
  },

  async updateSlot(input: {
    trainerId: string;
    slotId: string;
    startTime: string;
    endTime: string;
  }) {
    const slotResult = await query<TrainerAvailabilitySlotRecord>(
      `select * from trainer_availability_slots
       where id = $1 and trainer_id = $2
       limit 1`,
      [input.slotId, input.trainerId],
    );
    const slot = slotResult.rows[0];
    if (!slot) {
      throw new Error("Slot could not be found.");
    }

    const overlapping = await query<{ id: string }>(
      `select id
       from trainer_availability_slots
       where trainer_id = $1
         and weekday = $2
         and id <> $3
         and start_time < $5::time
         and end_time > $4::time
       limit 1`,
      [input.trainerId, slot.weekday, input.slotId, input.startTime, input.endTime],
    );
    if (overlapping.rows[0]) {
      throw new Error("This slot overlaps an existing slot for the selected day.");
    }

    const result = await query<TrainerAvailabilitySlotRecord>(
      `update trainer_availability_slots
       set start_time = $3::time,
           end_time = $4::time,
           updated_at = now()
       where id = $1 and trainer_id = $2
       returning *`,
      [input.slotId, input.trainerId, input.startTime, input.endTime],
    );
    return toSlot(result.rows[0]);
  },

  async createHoliday(input: { trainerId: string; date: string; note?: string }) {
    const result = await query<TrainerHolidayRecord>(
      `insert into trainer_holidays (trainer_id, holiday_date, note)
       values ($1, $2::date, $3)
       on conflict (trainer_id, holiday_date)
       do update set note = excluded.note
       returning id, trainer_id, holiday_date::text, note, created_at`,
      [input.trainerId, input.date, input.note ?? ""],
    );
    return toHoliday(result.rows[0]);
  },

  async deleteHoliday(input: { trainerId: string; holidayId: string }) {
    const result = await query<TrainerHolidayRecord>(
      `delete from trainer_holidays
       where id = $1 and trainer_id = $2
       returning id, trainer_id, holiday_date::text, note, created_at`,
      [input.holidayId, input.trainerId],
    );
    return result.rows[0] ? toHoliday(result.rows[0]) : null;
  },

  async createSlotException(input: {
    trainerId: string;
    slotId: string;
    date: string;
    reason?: string;
  }) {
    const slotResult = await query<TrainerAvailabilitySlotRecord>(
      `select * from trainer_availability_slots
       where id = $1 and trainer_id = $2
       limit 1`,
      [input.slotId, input.trainerId],
    );
    const slot = slotResult.rows[0];
    if (!slot) {
      throw new Error("Slot could not be found.");
    }

    const weekdayResult = await query<{ weekday: string }>(
      `select extract(dow from $1::date)::text as weekday`,
      [input.date],
    );
    if (Number(weekdayResult.rows[0]?.weekday) !== slot.weekday) {
      throw new Error("This slot does not belong to the selected day.");
    }

    const result = await query<TrainerSlotExceptionRecord>(
      `insert into trainer_slot_exceptions (trainer_id, slot_id, exception_date, reason)
       values ($1, $2, $3::date, $4)
       on conflict (trainer_id, slot_id, exception_date)
       do update set reason = excluded.reason
       returning id, trainer_id, slot_id, exception_date::text, reason, created_at`,
      [input.trainerId, input.slotId, input.date, input.reason ?? ""],
    );
    return toSlotException(result.rows[0]);
  },

  async deleteSlotException(input: { trainerId: string; exceptionId: string }) {
    const result = await query<TrainerSlotExceptionRecord>(
      `delete from trainer_slot_exceptions
       where id = $1 and trainer_id = $2
       returning id, trainer_id, slot_id, exception_date::text, reason, created_at`,
      [input.exceptionId, input.trainerId],
    );
    return result.rows[0] ? toSlotException(result.rows[0]) : null;
  },
};
