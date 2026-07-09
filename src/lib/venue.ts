import type { CalendarEvent, EventModality, ModalityFilter } from '../types/event';

/** Online-only venues can host multiple events at once */
const ONLINE_KEYWORDS = [
  'online', 'virtual', 'zoom', 'google meet', 'microsoft teams', 'ms teams',
  'webinar', 'livestream', 'live stream', 'facebook page', 'fb live', 'youtube',
  'online platform', 'telegram', 'discord', 'messenger', 'google classroom',
];

const PHYSICAL_INDICATORS = [
  'gym', 'center', 'centre', 'building', 'campus', 'ground', 'hall', 'room',
  'office', 'wvsu', 'college', 'auditorium', 'park', 'pescar', 'cultural',
  'com ', 'faculty', 'library', 'canteen', 'stage', 'field', 'laboratory', 'lab',
];

const UNDETERMINED_VENUE_KEYWORDS = [
  'tba', 'tbd', 'tbc',
  'to be determined', 'to be announced', 'to be confirmed',
  'not yet available', 'pending venue', 'venue pending',
];

const CAMPUS_TBA_HINTS = /\b(in[- ]?campus|on[- ]?campus|off[- ]?campus|physical|face[- ]?to[- ]?face)\b/;

function normalizeVenue(v: string) {
  return v.toLowerCase().trim().replace(/\s+/g, ' ');
}

function venueHasOnlineKeyword(v: string) {
  return ONLINE_KEYWORDS.some((kw) => v.includes(kw));
}

function venueHasPhysicalIndicator(v: string) {
  return PHYSICAL_INDICATORS.some((pi) => v.includes(pi));
}

function eventTextHasVirtualSignal(event: CalendarEvent) {
  const text = `${event.title} ${event.description} ${event.remarks}`.toLowerCase();
  return venueHasOnlineKeyword(text) || /\b(virtual|webinar|livestream)\b/.test(text);
}

/** TBA/TBD venues — date or place not finalized */
export function isUndeterminedVenue(venue: string): boolean {
  const v = normalizeVenue(venue);
  if (!v || v === 'n/a' || v === 'na') return true;
  if (CAMPUS_TBA_HINTS.test(v)) return false;
  return UNDETERMINED_VENUE_KEYWORDS.some((kw) => v === kw || v.includes(kw));
}

export function isOnlineVenue(venue: string): boolean {
  const v = normalizeVenue(venue);
  if (!v || isUndeterminedVenue(venue)) return false;
  const hasOnline = venueHasOnlineKeyword(v);
  if (!hasOnline) return false;
  return !venueHasPhysicalIndicator(v);
}

export function hasTentativeDate(event: CalendarEvent): boolean {
  const text = `${event.title} ${event.remarks} ${event.description}`.toLowerCase();
  return (
    /\b(tbd|tba)\b/.test(text) && /\b(date|schedul|when)\b/.test(text)
  ) || /\btentative\s+date\b/.test(text) || /\bdate\s+(is\s+)?tentative\b/.test(text);
}

export function getEventModality(event: CalendarEvent): EventModality {
  const v = normalizeVenue(event.location);

  if (!v) {
    return eventTextHasVirtualSignal(event) ? 'online' : 'undetermined';
  }

  if (isUndeterminedVenue(event.location)) {
    if (CAMPUS_TBA_HINTS.test(v)) return 'face-to-face';
    if (eventTextHasVirtualSignal(event)) return 'online';
    return 'undetermined';
  }

  const hasOnline = venueHasOnlineKeyword(v);
  const hasPhysical = venueHasPhysicalIndicator(v);

  if (hasOnline && hasPhysical) return 'hybrid';
  if (hasOnline) return 'online';
  return 'face-to-face';
}

export function matchesModalityFilter(event: CalendarEvent, filter: ModalityFilter): boolean {
  if (filter === 'all') return true;
  const modality = getEventModality(event);
  if (filter === 'online') return modality === 'online' || modality === 'hybrid';
  if (filter === 'face-to-face') return modality === 'face-to-face' || modality === 'hybrid';
  return true;
}

export const MODALITY_META: Record<EventModality, { label: string; short: string; className: string }> = {
  'face-to-face': {
    label: 'Face-to-face',
    short: 'In-person',
    className: 'bg-usc-mint-wash text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  },
  online: {
    label: 'Online',
    short: 'Online',
    className: 'bg-usc-sky-wash text-sky-800 dark:bg-sky-900/30 dark:text-sky-300',
  },
  hybrid: {
    label: 'Hybrid',
    short: 'Hybrid',
    className: 'bg-usc-gold-wash text-amber-900 dark:bg-usc-gold/15 dark:text-usc-gold',
  },
  undetermined: {
    label: 'Venue TBA',
    short: 'TBA',
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  },
};
