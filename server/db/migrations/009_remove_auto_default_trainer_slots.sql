delete from trainer_availability_slots
where start_time = '09:00'::time
  and end_time = '17:00'::time;
