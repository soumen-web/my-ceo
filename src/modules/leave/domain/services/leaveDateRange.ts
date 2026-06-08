import type { LeaveDayPart } from '../entities/Leave';

export interface LeaveDatePolicy {
  excludedWeekdays: number[];
}

export interface LeaveDateRangeSummary {
  countedDates: string[];
  excludedDates: string[];
  finalLeaveDays: number;
  rangeDates: string[];
  totalCalendarDays: number;
}

export const defaultLeaveDatePolicy: LeaveDatePolicy = {
  excludedWeekdays: [0],
};

export const getLeaveDateTime = (value: string): number =>
  new Date(`${value}T12:00:00`).getTime();

export const getLeaveDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const addLeaveDays = (value: string, offset: number): string => {
  const date = new Date(`${value}T12:00:00`);
  date.setDate(date.getDate() + offset);

  return getLeaveDateKey(date);
};

export const getLeaveDateRange = (startDate: string, endDate: string): string[] => {
  if (getLeaveDateTime(endDate) < getLeaveDateTime(startDate)) {
    return [];
  }

  const range: string[] = [];
  const cursor = new Date(`${startDate}T12:00:00`);
  const end = new Date(`${endDate}T12:00:00`);

  while (cursor.getTime() <= end.getTime()) {
    range.push(getLeaveDateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return range;
};

export const isLeaveExcludedDate = (
  date: string,
  policy: LeaveDatePolicy = defaultLeaveDatePolicy,
): boolean => policy.excludedWeekdays.includes(new Date(`${date}T12:00:00`).getDay());

export const getLeaveDateRangeSummary = (
  startDate: string,
  endDate: string,
  dayPart: LeaveDayPart,
  policy: LeaveDatePolicy = defaultLeaveDatePolicy,
): LeaveDateRangeSummary => {
  const rangeDates = getLeaveDateRange(startDate, endDate);
  const countedDates = rangeDates.filter((date) => !isLeaveExcludedDate(date, policy));
  const excludedDates = rangeDates.filter((date) => isLeaveExcludedDate(date, policy));
  const finalLeaveDays =
    dayPart === 'full-day'
      ? countedDates.length
      : countedDates.length > 0
        ? 0.5
        : 0;

  return {
    countedDates,
    excludedDates,
    finalLeaveDays,
    rangeDates,
    totalCalendarDays: rangeDates.length,
  };
};
