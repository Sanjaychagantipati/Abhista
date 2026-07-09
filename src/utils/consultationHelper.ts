import type { ConsultationStatus } from '../types/consultation/consultationTypes';

/**
 * Returns CSS color class styling for consultation statuses.
 */
export function getConsultationStatusBadgeClass(status: ConsultationStatus): string {
  switch (status) {
    case 'REQUESTED':
      return 'text-amber-800 bg-amber-100 border-amber-200';
    case 'ACCEPTED':
      return 'text-blue-800 bg-blue-100 border-blue-200';
    case 'RESCHEDULED':
      return 'text-indigo-800 bg-indigo-100 border-indigo-200';
    case 'COMPLETED':
      return 'text-emerald-800 bg-emerald-100 border-emerald-200';
    case 'CANCELLED':
      return 'text-rose-800 bg-rose-100 border-rose-200';
    default:
      return 'text-stone-700 bg-stone-100 border-stone-200';
  }
}

/**
 * Converts weekly integer day indexes to weekday names.
 */
export function getDayName(dayOfWeek: number): string {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return days[dayOfWeek] || 'Unknown';
}

/**
 * Helper to display readable consultation details.
 */
export function formatConsultationType(type: string): string {
  return type || 'Google Meet / Online Video';
}
