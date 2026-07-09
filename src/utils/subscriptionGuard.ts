import type { UserSubscription } from '../types/subscription/subscriptionTypes';

/**
 * Checks if a customer subscription is currently active and valid.
 */
export function hasPremiumAccess(subscription: UserSubscription | null | undefined): boolean {
  if (!subscription) {
    return false;
  }

  if (subscription.status !== 'ACTIVE') {
    return false;
  }

  const now = new Date();
  const endDate = new Date(subscription.endDate);
  return endDate >= now;
}

/**
 * Checks if the user is authorized to view a provider's phone number.
 * Admins have global access; customers require an active subscription.
 */
export function canViewPhoneNumber(
  subscription: UserSubscription | null | undefined,
  userRole?: string
): boolean {
  if (userRole === 'ROLE_ADMIN') {
    return true;
  }
  return hasPremiumAccess(subscription);
}

/**
 * Checks if the user is authorized to book expert consultations.
 * Admins have global access; customers require an active subscription.
 */
export function canBookConsultation(
  subscription: UserSubscription | null | undefined,
  userRole?: string
): boolean {
  if (userRole === 'ROLE_ADMIN') {
    return true;
  }
  return hasPremiumAccess(subscription);
}

/**
 * Helper to display human-readable subscription status.
 */
export function getSubscriptionStatusLabel(subscription: UserSubscription | null | undefined): {
  label: string;
  className: string;
} {
  if (!subscription) {
    return { label: 'No Active Subscription', className: 'text-stone-500 bg-stone-100' };
  }

  const active = hasPremiumAccess(subscription);
  if (active) {
    return { label: 'Active Premium Plan', className: 'text-emerald-800 bg-emerald-100' };
  }

  if (subscription.status === 'CANCELLED') {
    return { label: 'Subscription Cancelled', className: 'text-amber-800 bg-amber-100' };
  }

  return { label: 'Plan Expired', className: 'text-rose-800 bg-rose-100' };
}
