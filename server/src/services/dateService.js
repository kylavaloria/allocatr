import { getPool } from '../config/database.js';

/**
 * Get all holidays from database (cached)
 */
let holidaysCache = null;
let holidaysCacheTime = null;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

async function getHolidays() {
  const now = Date.now();

  if (holidaysCache && holidaysCacheTime && (now - holidaysCacheTime < CACHE_DURATION)) {
    return holidaysCache;
  }

  try {
    const pool = getPool();
    const result = await pool.request().query('SELECT HolidayDate FROM Holidays');

    holidaysCache = result.recordset.map(row => {
      const date = new Date(row.HolidayDate);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    });

    holidaysCacheTime = now;
    return holidaysCache;
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return [];
  }
}

/**
 * Clear holidays cache (call this when holidays are modified)
 */
export function clearHolidaysCache() {
  holidaysCache = null;
  holidaysCacheTime = null;
}

/**
 * Check if a date is a weekend (Saturday or Sunday)
 */
function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
}

/**
 * Check if a date is a holiday
 */
async function isHoliday(date) {
  const holidays = await getHolidays();
  const dateTime = new Date(date).setHours(0, 0, 0, 0);
  return holidays.includes(dateTime);
}

/**
 * Calculate working days between two dates (NETWORKDAYS equivalent)
 * Excludes weekends and holidays
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<number>} - Number of working days
 */
export async function getNetworkDays(startDate, endDate) {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  // If start is after end, return 0
  if (start > end) return 0;

  const holidays = await getHolidays();
  let workingDays = 0;
  const current = new Date(start);

  while (current <= end) {
    const currentTime = current.getTime();

    // Check if current day is not a weekend and not a holiday
    if (!isWeekend(current) && !holidays.includes(currentTime)) {
      workingDays++;
    }

    current.setDate(current.getDate() + 1);
  }

  return workingDays;
}

/**
 * Get the Monday of the current week
 */
export function getWeekStart(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // If Sunday, go back 6 days, else go to Monday

  d.setDate(d.getDate() + diff);
  return d;
}

/**
 * Get the Friday of the current week
 */
export function getWeekEnd(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  const day = d.getDay();
  const diff = day === 0 ? -2 : 5 - day; // If Sunday, go back 2 days, else go to Friday

  d.setDate(d.getDate() + diff);
  return d;
}

/**
 * Add working days to a date (skips weekends and holidays)
 *
 * @param {Date} startDate - Starting date
 * @param {number} daysToAdd - Number of working days to add
 * @returns {Promise<Date>} - Resulting date
 */
export async function addWorkDays(startDate, daysToAdd) {
  if (!startDate || daysToAdd <= 0) return startDate;

  const holidays = await getHolidays();
  const result = new Date(startDate);
  result.setHours(0, 0, 0, 0);

  let addedDays = 0;

  while (addedDays < daysToAdd) {
    result.setDate(result.getDate() + 1);
    const resultTime = result.getTime();

    // Only count if not weekend and not holiday
    if (!isWeekend(result) && !holidays.includes(resultTime)) {
      addedDays++;
    }
  }

  return result;
}

/**
 * Format date to YYYY-MM-DD
 */
export function formatDate(date) {
  if (!date) return null;
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if date is today
 */
export function isToday(date) {
  const today = new Date();
  const d = new Date(date);

  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if date is before another date
 */
export function isBefore(date1, date2) {
  return new Date(date1) < new Date(date2);
}

/**
 * Check if date is after another date
 */
export function isAfter(date1, date2) {
  return new Date(date1) > new Date(date2);
}
