import { db } from '../utils/db.js';
import { verifyActiveSubscription } from './subscriptionService.js';

export async function getProviderDashboardSummary(userId: string) {
  // Find provider profile
  const profile = await db.providerProfile.findUnique({
    where: { userId },
    include: { category: true },
  });

  if (!profile) {
    throw new Error('Provider profile not found');
  }

  // 1. Calculate Profile Completion Percentage
  const fields = [
    profile.fullName,
    profile.businessName,
    profile.description,
    profile.phoneNumber,
    profile.city,
    profile.state,
    profile.experienceYears,
    profile.serviceAreas,
  ];
  const filledFields = fields.filter((f) => f !== null && f !== undefined && f !== '').length;
  const profileCompletion = Math.round((filledFields / fields.length) * 100);

  // 2. Fetch Active Subscription
  const activeSubscription = await db.userSubscription.findFirst({
    where: { userId, status: 'ACTIVE' },
    include: { plan: true },
  });

  let subscriptionDetails = null;
  if (activeSubscription) {
    // Perform auto-expiration check
    const now = new Date();
    const endDate = new Date(activeSubscription.endDate);
    if (endDate < now) {
      // Auto-expire
      await db.userSubscription.update({
        where: { id: activeSubscription.id },
        data: { status: 'EXPIRED' },
      });
    } else {
      subscriptionDetails = {
        planName: activeSubscription.plan.name,
        endDate: activeSubscription.endDate,
        isActive: true,
      };
    }
  }

  // 3. Booking Stats
  const bookingCounts = await db.booking.groupBy({
    by: ['bookingStatus'],
    where: { providerId: profile.id },
    _count: true,
  });

  const bookingsStats = {
    pending: 0,
    accepted: 0,
    completed: 0,
    cancelled: 0,
  };

  for (const group of bookingCounts) {
    const status = group.bookingStatus as string;
    const count = group._count;
    if (status === 'PENDING') bookingsStats.pending = count;
    else if (status === 'ACCEPTED') bookingsStats.accepted = count;
    else if (status === 'COMPLETED') bookingsStats.completed = count;
    else if (status === 'CANCELLED') bookingsStats.cancelled = count;
  }

  // 4. Rating Stats
  const ratingAgg = await db.review.aggregate({
    where: { providerId: profile.id },
    _avg: { rating: true },
    _count: { rating: true },
  });

  const ratingStats = {
    averageRating: ratingAgg._avg.rating ? parseFloat(ratingAgg._avg.rating.toFixed(1)) : 0.0,
    totalReviews: ratingAgg._count.rating || 0,
  };

  // 5. Portfolio Summary
  const portfolioCount = await db.portfolio.count({
    where: { providerId: profile.id },
  });

  // 6. Recent Bookings (Limit 5)
  const recentBookings = await db.booking.findMany({
    where: { providerId: profile.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      customer: {
        select: {
          fullName: true,
          phoneNumber: true,
        },
      },
    },
  });

  // 7. Recent Service Requests / Requirements matching provider category name (Limit 5)
  const recentRequirements = await db.requirement.findMany({
    where: {
      serviceCategory: profile.category.name,
      status: 'OPEN',
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      customer: {
        select: {
          fullName: true,
        },
      },
    },
  });

  // 8. Recent Reviews (Limit 5)
  const recentReviews = await db.review.findMany({
    where: { providerId: profile.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      customer: {
        select: {
          fullName: true,
        },
      },
    },
  });

  // 9. Mock/Static notifications for UX completeness
  const notifications = [
    {
      id: 1,
      title: 'Welcome to Abhista 2.0',
      description: 'Explore your new provider control center dashboard.',
      createdAt: new Date(),
    },
  ];

  if (bookingsStats.pending > 0) {
    notifications.push({
      id: 2,
      title: 'New Booking Requests Received',
      description: `You have ${bookingsStats.pending} pending requests awaiting response.`,
      createdAt: new Date(),
    });
  }

  const isVerified = profile.verificationStatus === 'VERIFIED';

  return {
    profile: {
      fullName: profile.fullName,
      businessName: profile.businessName,
      isVerified,
      experienceYears: profile.experienceYears,
      availabilityStatus: profile.availabilityStatus,
      categoryName: profile.category?.name || 'Service Partner',
    },
    profileCompletion,
    verificationStatus: profile.verificationStatus,
    availabilityStatus: profile.availabilityStatus,
    subscription: subscriptionDetails,
    stats: {
      ...bookingsStats,
      ...ratingStats,
      portfolioCount,
    },
    recentBookings,
    recentRequirements,
    recentReviews,
    notifications,
  };
}

export async function updateProviderAvailability(userId: string, status: 'AVAILABLE' | 'BUSY' | 'ON_LEAVE') {
  // Check if status value is valid
  const allowed = ['AVAILABLE', 'BUSY', 'ON_LEAVE'];
  if (!allowed.includes(status)) {
    throw new Error('Invalid availability status value');
  }

  const profile = await db.providerProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new Error('Provider profile not found');
  }

  // Update status. Set isAvailable boolean true if AVAILABLE, otherwise false
  const updated = await db.providerProfile.update({
    where: { id: profile.id },
    data: {
      availabilityStatus: status,
      isAvailable: status === 'AVAILABLE',
    },
  });

  return updated;
}
