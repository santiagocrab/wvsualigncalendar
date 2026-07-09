export type EventCategory =
  | 'National Holiday'
  | 'WVSU Calendar'
  | 'USC Events'
  | 'Org/CSC Calendared Event'
  | 'Org/CSC Proposed Event'
  | 'Org/CSC Outreach Programs';

export type EventStatus =
  | 'Approved'
  | 'Pending Approval'
  | 'Proposed'
  | 'Needs Revision'
  | 'Cancelled';

export type EventType =
  | 'Academic'
  | 'Orientation'
  | 'General Assembly'
  | 'Training / Workshop'
  | 'Sports / Wellness'
  | 'Cultural / Arts'
  | 'Outreach / Extension'
  | 'Advocacy'
  | 'Competition'
  | 'Publication / Media'
  | 'Holiday'
  | 'Examination'
  | 'University Event'
  | 'Recognition / Ceremony'
  | 'Fundraising'
  | 'Internal Organization Activity'
  | 'Other';

export interface CalendarEvent {
  id: string;
  title: string;
  organization: string;
  host: string;
  category: EventCategory;
  eventType: EventType | string;
  status: EventStatus;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  mapLink: string;
  targetParticipants: string;
  description: string;
  contactPerson: string;
  sourceFile: string;
  remarks: string;
  createdAt: string;
  updatedAt: string;
}

export type ConflictSeverity = 'Low' | 'Medium' | 'High';

export interface EventConflict {
  id: string;
  date: string;
  type: string;
  severity: ConflictSeverity;
  event1: CalendarEvent;
  event2?: CalendarEvent;
  venue: string;
  recommendation: string;
}

export type CalendarView = 'month' | 'week' | 'list';

export interface EventFormData extends Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'> {}
