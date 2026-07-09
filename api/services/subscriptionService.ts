import { db } from '../utils/db.js';
import { SubscriptionStatus } from '@prisma/client';

export interface CreatePlanInput {
  name: string;
  price: number;
  durationDays: number;
  description?: string | null;
  features?: any;
}

export interface UpdatePlanInput {
  name?: string;
  price?: number;
  durationDays?: number;
  description?: string | null;
  features?: any;
  isActive?: boolean;
}

// Check and update expired subscriptions on-the-fly
export async function verifyActiveSubscription(userId: string): Promise<boolean> {
  const now = new Date();
  
  // Find all ACTIVE subscriptions for this user
  const activeSubs = await db.userSubscription.findMany({
    where: { userId, status: SubscriptionStatus.ACTIVE },
  });

  let hasActive = false;
  for (const sub of activeSubs) {
    if (sub.endDate < now) {
      // Auto-expire past subscription
      await db.userSubscription.update({
        where: { id: sub.id },
        data: { status: SubscriptionStatus.EXPIRED },
      });
    } else {
      hasActive = true;
    }
  }

  return hasActive;
}

export async function getSubscriptionPlans(includeInactive = false) {
  return await db.subscriptionPlan.findMany({
    where: includeInactive ? {} : { isActive: true },
    orderBy: { price: 'asc' },
  });
}

export async function getMySubscription(userId: string) {
  // First run check to update any expired ones
  await verifyActiveSubscription(userId);

  return await db.userSubscription.findFirst({
    where: {
      userId,
      status: SubscriptionStatus.ACTIVE,
    },
    include: {
      plan: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function activateSubscription(userId: string, planId: number) {
  const plan = await db.subscriptionPlan.findUnique({
    where: { id: Number(planId) },
  });

  if (!plan) {
    throw new Error('Subscription plan not found');
  }

  if (!plan.isActive) {
    throw new Error('Selected plan is currently inactive');
  }

  // Enforce no duplicate active subscriptions
  const hasActive = await verifyActiveSubscription(userId);
  if (hasActive) {
    throw new Error('Forbidden: You already have an active subscription');
  }

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + plan.durationDays);

  const transactionReference = `SUB-TX-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  return await db.userSubscription.create({
    data: {
      userId,
      planId: plan.id,
      status: SubscriptionStatus.ACTIVE,
      startDate,
      endDate,
      transactionReference,
    },
    include: {
      plan: true,
    },
  });
}

export async function cancelSubscription(userId: string) {
  const activeSub = await db.userSubscription.findFirst({
    where: {
      userId,
      status: SubscriptionStatus.ACTIVE,
    },
  });

  if (!activeSub) {
    throw new Error('No active subscription found to cancel');
  }

  return await db.userSubscription.update({
    where: { id: activeSub.id },
    data: {
      status: SubscriptionStatus.CANCELLED,
    },
    include: {
      plan: true,
    },
  });
}

// Admin Operations
export async function adminCreatePlan(input: CreatePlanInput) {
  if (!input.name || input.price === undefined || !input.durationDays) {
    throw new Error('Missing required plan parameters');
  }

  return await db.subscriptionPlan.create({
    data: {
      name: input.name,
      price: Number(input.price),
      durationDays: Number(input.durationDays),
      description: input.description,
      features: input.features || {},
      isActive: true,
    },
  });
}

export async function adminUpdatePlan(id: number, input: UpdatePlanInput) {
  const plan = await db.subscriptionPlan.findUnique({ where: { id: Number(id) } });
  if (!plan) {
    throw new Error('Subscription plan not found');
  }

  return await db.subscriptionPlan.update({
    where: { id: Number(id) },
    data: {
      name: input.name,
      price: input.price !== undefined ? Number(input.price) : undefined,
      durationDays: input.durationDays !== undefined ? Number(input.durationDays) : undefined,
      description: input.description,
      features: input.features,
      isActive: input.isActive,
    },
  });
}

export async function adminDeletePlan(id: number) {
  const plan = await db.subscriptionPlan.findUnique({ where: { id: Number(id) } });
  if (!plan) {
    throw new Error('Subscription plan not found');
  }

  // Perform soft delete by setting isActive to false
  return await db.subscriptionPlan.update({
    where: { id: Number(id) },
    data: { isActive: false },
  });
}
