// Core constants for the application

export const JWT_CONSTANTS = {
  SECRET:
    process.env.JWT_SECRET || 'gym-management-secret-key-change-in-production',
  EXPIRES_IN: '24h',
  REFRESH_EXPIRES_IN: '7d',
};

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  TRAINER: 'trainer',
  MEMBER: 'member',
} as const;

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
} as const;

export const MEMBERSHIP_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  SUSPENDED: 'suspended',
  CANCELLED: 'cancelled',
} as const;

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export const TRANSACTION_TYPE = {
  MEMBERSHIP: 'membership',
  RENEWAL: 'renewal',
  UPGRADE: 'upgrade',
  REFUND: 'refund',
} as const;
