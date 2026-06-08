export interface WorkModeInfo {
  employmentType: string;
  holidayCalendar: string;
  shiftCalendar: string;
  workMode: string;
  workWeek: string;
}

export const createEmptyWorkModeInfo = (): WorkModeInfo => ({
  employmentType: '',
  holidayCalendar: '',
  shiftCalendar: '',
  workMode: '',
  workWeek: '',
});
