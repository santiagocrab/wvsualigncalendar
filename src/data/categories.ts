import type { EventCategory, EventStatus, EventType } from '../types/event';

export const BRAND = {
  gold: '#C9953A',
  goldDark: '#A67B2A',
  black: '#3A3632',
  white: '#FFFFFF',
  cream: '#F5F3F0',
  darkText: '#5C5650',
} as const;

export const CATEGORY_META: Record<
  EventCategory,
  { color: string; textColor: string; bgLight: string; countColor: string; short: string }
> = {
  'National Holiday': { color: '#C00000', textColor: '#FFFFFF', bgLight: '#FEE2E2', countColor: '#991B1B', short: 'Holiday' },
  'WVSU Calendar': { color: '#2563EB', textColor: '#FFFFFF', bgLight: '#DBEAFE', countColor: '#1E40AF', short: 'WVSU' },
  'USC Events': { color: '#C9953A', textColor: '#3A3632', bgLight: '#F9F3E8', countColor: '#92400E', short: 'USC' },
  'Org/CSC Calendared Event': { color: '#EA580C', textColor: '#FFFFFF', bgLight: '#FFEDD5', countColor: '#C2410C', short: 'Calendared' },
  'Org/CSC Proposed Event': { color: '#00B050', textColor: '#FFFFFF', bgLight: '#DCFCE7', countColor: '#047857', short: 'Proposed' },
  'Org/CSC Outreach Programs': { color: '#C00080', textColor: '#FFFFFF', bgLight: '#FCE7F6', countColor: '#9D174D', short: 'Outreach' },
};

export const STATUS_META: Record<EventStatus, { color: string; bg: string }> = {
  Approved: { color: '#166534', bg: '#DCFCE7' },
  'Pending Approval': { color: '#92400E', bg: '#FEF3C7' },
  Proposed: { color: '#15803D', bg: '#BBF7D0' },
  'Needs Revision': { color: '#C2410C', bg: '#FFEDD5' },
  Cancelled: { color: '#6B7280', bg: '#F3F4F6' },
};

export const EVENT_TYPES: EventType[] = [
  'Academic', 'Orientation', 'General Assembly', 'Training / Workshop',
  'Sports / Wellness', 'Cultural / Arts', 'Outreach / Extension', 'Advocacy',
  'Competition', 'Publication / Media', 'Holiday', 'Examination',
  'University Event', 'Recognition / Ceremony', 'Fundraising',
  'Internal Organization Activity', 'Other',
];

export const CATEGORIES: EventCategory[] = Object.keys(CATEGORY_META) as EventCategory[];

export const USC_NOTICE =
  'Proposed Events are subject for approval and may change. Please be guided by the legends below.';
