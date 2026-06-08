import type { HomeDashboard } from "@/modules/home/domain/entities/HomeDashboard";

export const getHomeDashboardSnapshot = (): HomeDashboard => ({
  attendanceByMonth: [
    { absent: 1, leave: 2, month: "Jan", present: 19 },
    { absent: 2, leave: 1, month: "Feb", present: 17 },
    { absent: 1, leave: 1, month: "Mar", present: 20 },
    { absent: 3, leave: 2, month: "Apr", present: 16 },
    { absent: 2, leave: 1, month: "May", present: 18 },
    { absent: 1, leave: 3, month: "Jun", present: 17 },
    { absent: 1, leave: 2, month: "Jul", present: 21 },
    { absent: 2, leave: 2, month: "Aug", present: 18 },
    { absent: 1, leave: 1, month: "Sep", present: 19 },
    { absent: 2, leave: 1, month: "Oct", present: 20 },
    { absent: 1, leave: 2, month: "Nov", present: 18 },
    { absent: 2, leave: 1, month: "Dec", present: 19 },
  ],
  employee: {
    avatarUrl: "",
    role: "Employee",
  },
  notes: [
    {
      body: "Location, shift, and device checks are prepared for Workforce Hub attendance workflows.",
      id: "attendance-readiness",
      title: "Attendance readiness",
    },
    {
      body: "Employee profile, team, requests, and work-location shortcuts are available from the dashboard shell.",
      id: "organization-workspace",
      title: "Organization workspace",
    },
  ],
  quickActions: [
    {
      icon: "check-circle",
      id: "daily-attendance",
      label: "Daily Tracker",
    },
    { icon: "edit-3", id: "apply-leave", label: "Apply Leave" },
    {
      icon: "file-text",
      id: "current-salary-slip",
      label: "Current Payslip",
    },
    { icon: "clipboard", id: "requests", label: "My Requests" },
    {
      icon: "settings",
      id: "attendance-readiness",
      label: "Attendance Readiness",
    },
  ],
  stats: [
    { icon: "calendar", id: "working-days", label: "Working Days", value: "0" },
    { icon: "briefcase", id: "holidays", label: "Holidays", value: "1" },
    { icon: "clock", id: "shift-timing", label: "Shift Timing", value: "--" },
  ],
});
