/**
 * Prefetch Configuration
 * 
 * This file contains configuration for prefetching routes throughout the application.
 * All navigation components should use Next.js Link with prefetch={true} for optimal performance.
 */

export const PREFETCH_ROUTES = {
  // Authentication routes
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  
  // Main app routes
  APP: {
    HOME: '/',
    CHAT: '/chat',
    CREATE: '/create',
  },
  
  // Account routes
  ACCOUNT: {
    MAIN: '/account',
    PERSONAL_INFO: '/account/personal-info',
    RESET_PASSWORD: '/account/reset-password',
  },
  
  // Dynamic routes (use functions to generate)
  DYNAMIC: {
    ROOM: (roomId: string) => `/${roomId}`,
    DIRECT_MESSAGE: (userId: string) => `/direct/${userId}`,
  }
} as const;

/**
 * Level 1 Routes - Always prefetched on app load
 */
export const LEVEL_1_ROUTES = [
  PREFETCH_ROUTES.APP.CHAT,
  PREFETCH_ROUTES.APP.CREATE,
  PREFETCH_ROUTES.ACCOUNT.MAIN,
] as const;

/**
 * Level 2 Routes - Prefetched when user interacts with Level 1
 */
export const LEVEL_2_ROUTES = {
  [PREFETCH_ROUTES.APP.CHAT]: [], // Chat has dynamic rooms, handled separately
  [PREFETCH_ROUTES.APP.CREATE]: [], // Create is standalone
  [PREFETCH_ROUTES.ACCOUNT.MAIN]: [
    PREFETCH_ROUTES.ACCOUNT.PERSONAL_INFO,
    PREFETCH_ROUTES.ACCOUNT.RESET_PASSWORD,
    PREFETCH_ROUTES.ACCOUNT.LOGOUT,
  ],
} as const;

/**
 * Routes that should be prefetched when user is authenticated
 */
export const AUTHENTICATED_PREFETCH_ROUTES = [
  PREFETCH_ROUTES.APP.CHAT,
  PREFETCH_ROUTES.APP.CREATE,
  PREFETCH_ROUTES.ACCOUNT.MAIN,
] as const;

/**
 * Routes that should be prefetched when user is not authenticated
 */
export const UNAUTHENTICATED_PREFETCH_ROUTES = [
  PREFETCH_ROUTES.AUTH.LOGIN,
  PREFETCH_ROUTES.AUTH.REGISTER,
] as const;
