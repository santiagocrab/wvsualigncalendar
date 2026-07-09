import { parseISO, eachDayOfInterval, format } from 'date-fns';
import type { CalendarEvent, EventConflict } from '../types/event';

const HIGH_VENUES = ['com gym', 'cultural center', 'pescar', 'med gym', 'wvsu grounds', 'wellness park'];

/** Online-only venues can host multiple events at once — never flag as clashes */
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

function normalizeVenue(v: string) {
  return v.toLowerCase().trim().replace(/\s+/g, ' ');
}

function normalizeHost(host: string) {
  return host.toLowerCase().trim().replace(/\s+/g, ' ');
}

export function isOnlineVenue(venue: string): boolean {
  const v = normalizeVenue(venue);
  if (!v || isUndeterminedVenue(venue)) return false;
  const hasOnline = ONLINE_KEYWORDS.some((kw) => v.includes(kw));
  if (!hasOnline) return false;
  const hasPhysical = PHYSICAL_INDICATORS.some((pi) => v.includes(pi));
  return !hasPhysical;
}

/** TBA/TBD venues — date or place not finalized, cannot be a real clash */
export function isUndeterminedVenue(venue: string): boolean {
  const v = normalizeVenue(venue);
  if (!v || v === 'n/a' || v === 'na') return true;
  return UNDETERMINED_VENUE_KEYWORDS.some((kw) => v === kw || v.includes(kw));
}

/** Event date still marked tentative in submission text */
export function hasTentativeDate(event: CalendarEvent): boolean {
  const text = `${event.title} ${event.remarks} ${event.description}`.toLowerCase();
  return (
    /\b(tbd|tba)\b/.test(text) && /\b(date|schedul|when)\b/.test(text)
  ) || /\btentative\s+date\b/.test(text) || /\bdate\s+(is\s+)?tentative\b/.test(text);
}

function isSameHost(a: CalendarEvent, b: CalendarEvent): boolean {
  const ha = normalizeHost(a.host);
  const hb = normalizeHost(b.host);
  return ha.length > 0 && ha === hb;
}

function isHighTrafficVenue(venue: string) {
  return HIGH_VENUES.some((hv) => venue.includes(hv));
}

function expandEventDays(event: CalendarEvent): string[] {
  const start = parseISO(event.startDate);
  const end = parseISO(event.endDate);
  return eachDayOfInterval({ start, end }).map((d) => format(d, 'yyyy-MM-dd'));
}

export function detectConflicts(events: CalendarEvent[]): EventConflict[] {
  const conflicts: EventConflict[] = [];
  const byDate = new Map<string, CalendarEvent[]>();

  for (const event of events) {
    if (event.status === 'Cancelled' || hasTentativeDate(event)) continue;
    for (const day of expandEventDays(event)) {
      if (!byDate.has(day)) byDate.set(day, []);
      byDate.get(day)!.push(event);
    }
  }

  let cid = 1;
  for (const [day, dayEvents] of byDate) {
    const orgEvents = dayEvents.filter(
      (e) => !['National Holiday', 'WVSU Calendar'].includes(e.category)
    );

    const venueMap = new Map<string, CalendarEvent[]>();
    for (const e of orgEvents) {
      const venue = normalizeVenue(e.location);
      if (!venue || isUndeterminedVenue(e.location) || isOnlineVenue(e.location)) continue;
      if (!venueMap.has(venue)) venueMap.set(venue, []);
      venueMap.get(venue)!.push(e);
    }

    for (const [venue, venueEvents] of venueMap) {
      if (venueEvents.length < 2) continue;

      for (let i = 0; i < venueEvents.length - 1; i++) {
        for (let j = i + 1; j < venueEvents.length; j++) {
          // Same org/host may stack multiple activities at one venue on one day
          if (isSameHost(venueEvents[i], venueEvents[j])) continue;

          const displayVenue = venueEvents[i].location;
          conflicts.push({
            id: `conf-${cid++}`,
            date: day,
            type: 'Same venue conflict',
            severity: isHighTrafficVenue(venue) ? 'High' : 'Medium',
            event1: venueEvents[i],
            event2: venueEvents[j],
            venue: displayVenue,
            recommendation: `Different organizations are scheduled at ${displayVenue} on the same date. Coordinate with OSA or reschedule one activity.`,
          });
        }
      }
    }
  }

  return conflicts.sort((a, b) => a.date.localeCompare(b.date) || a.venue.localeCompare(b.venue));
}

export function getConflictsForEvent(conflicts: EventConflict[], eventId: string) {
  return conflicts.filter((c) => c.event1.id === eventId || c.event2?.id === eventId);
}
