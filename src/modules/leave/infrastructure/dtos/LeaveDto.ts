export type LeaveRecordDto = Record<string, unknown>;

export interface LeaveEnvelopeDto<TData = unknown> {
  data?: TData;
  message?: string;
  success?: boolean;
}

export interface ApplyLeaveRequestDto {
  dayPart: string;
  endDate: string;
  endDateType?: string;
  reason: string;
  selectedDates?: {
    date: string;
    dayType: string;
    value: number;
  }[];
  startDate: string;
  startDateType?: string;
  totalDays?: number;
  type: string;
}
