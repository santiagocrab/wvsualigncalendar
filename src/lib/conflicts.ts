import { parseISO, eachDayOfInterval, format } from 'date-fns';
import type { CalendarEvent, EventConflict } from '../types/event';
import { hasTentativeDate, isOnlineVenue, isUndeterminedVenue } from './venue';

const HIGH_VENUES = ['com gym', 'cultural center', 'pescar', 'med gym', 'wvsu grounds', 'wellness park'];

function normalizeVenue(v: string) {
  return v.toLowerCase().trim().replace(/\s+/g, ' ');
}

function normalizeHost(host: string) {
  return host.toLowerCase().trim().replace(/\s+/g, ' ');
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
