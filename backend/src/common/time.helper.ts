/**
 * Timezone Utility for Indian Standard Time (IST - Asia/Kolkata / UTC+05:30)
 * Ensures all attendance, check-ins, check-outs, and curfews strictly run on IST
 * regardless of where the cloud database (e.g. AWS Ohio us-east-2) or server is hosted.
 */

export const INDIAN_TIMEZONE = 'Asia/Kolkata';

// Get Current Date in IST as 'YYYY-MM-DD'
export function getIndianDateString(date: Date = new Date()): string {
  // 'en-CA' outputs ISO format YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: INDIAN_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

// Get Current Time in IST formatted as '06:15:30 AM'
export function getIndianTimeString(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: INDIAN_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date);
}

// Get Current Hour in IST (0 to 23)
export function getIndianHour(date: Date = new Date()): number {
  const hourStr = new Intl.DateTimeFormat('en-US', {
    timeZone: INDIAN_TIMEZONE,
    hour: 'numeric',
    hour12: false,
  }).format(date);
  return parseInt(hourStr, 10);
}

// Check if 10:00 PM Night Curfew is Active in India (10 PM to 6 AM)
export function isIndianCurfewActive(date: Date = new Date()): boolean {
  const hour = getIndianHour(date);
  return hour >= 22 || hour < 6;
}
