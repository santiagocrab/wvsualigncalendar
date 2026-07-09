import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  format, parseISO, isWithinInterval, isSameDay, startOfWeek, endOfWeek,
  eachDayOfInterval, isToday, addMonths, subMonths, startOfMonth, endOfMonth,
} from 'date-fns';
import type { CalendarEvent } from '../types/event';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(d: string) {
  return format(parseISO(d), 'MMM d, yyyy');
}

export function formatDateShort(d: string) {
  return format(parseISO(d), 'MMM d');
}

export function formatTimeRange(start: string, end: string) {
  if (!start) return 'All day';
  return end ? `${start} – ${end}` : start;
}

export function eventOnDate(event: CalendarEvent, day: Date) {
  const start = parseISO(event.startDate);
  const end = parseISO(event.endDate);
  return isWithinInterval(day, { start, end }) || isSameDay(day, start) || isSameDay(day, end);
}

export function getEventsForDay(events: CalendarEvent[], day: Date) {
  return events.filter((e) => eventOnDate(e, day));
}

export function getMonthDays(year: number, month: number) {
  const start = startOfWeek(startOfMonth(new Date(year, month, 1)), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(new Date(year, month, 1)), { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
}

export function getWeekDays(anchor: Date) {
  const start = startOfWeek(anchor, { weekStartsOn: 0 });
  const end = endOfWeek(anchor, { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
}

export { isToday, addMonths, subMonths, format, parseISO, startOfMonth };

export function copyEventDetails(event: CalendarEvent) {
  return [
    event.title,
    `Hosted by: ${event.host}`,
    `Date: ${formatDate(event.startDate)}${event.endDate !== event.startDate ? ' – ' + formatDate(event.endDate) : ''}`,
    `Time: ${formatTimeRange(event.startTime, event.endTime)}`,
    `Location: ${event.location}`,
    `Category: ${event.category}`,
    `Status: ${event.status}`,
    event.description,
  ].join('\n');
}
