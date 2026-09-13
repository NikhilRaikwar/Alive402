create index if not exists alive402_sessions_enrollment_idx
  on alive402_sessions(enrollment_id);

create index if not exists alive402_payments_run_idx
  on alive402_payments(run_id);
