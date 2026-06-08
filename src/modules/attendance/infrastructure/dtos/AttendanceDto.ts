export type AttendanceRecordDto = Record<string, unknown>;

export interface AttendanceEnvelopeDto<TData = unknown> {
  data?: TData;
  message?: string;
  meta?: unknown;
  success?: boolean;
}

export interface AttendancePunchRequestDto {
  mode: string;
  note?: string;
  punchType: string;
}

export type AttendanceSnapshotDto = AttendanceEnvelopeDto<AttendanceRecordDto>;
export type AttendanceDayDetailDto = AttendanceEnvelopeDto<AttendanceRecordDto>;
