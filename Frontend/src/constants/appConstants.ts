// Application-wide constants

// Trade Categories
export const TRADE_CATEGORIES = [
  "General",
  "Carpenter",
  "Plumber",
  "Electrician",
  "Painter",
  "Mason",
  "Welder",
  "HVAC Technician",
  "Landscaper",
  "Product Manager",
  "Designer",
  "Data Scientist",
  "Other"
] as const;

export type TradeCategory = typeof TRADE_CATEGORIES[number];

// Form Validation Limits
export const VALIDATION_LIMITS = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  HEADLINE_MAX_LENGTH: 220,
  LOCATION_MAX_LENGTH: 100,
  BIO_MAX_LENGTH: 2600,
  COMMENT_MAX_LENGTH: 500,
  POST_DESCRIPTION_MAX_LENGTH: 3000,
  BOOKING_MESSAGE_MAX_LENGTH: 500
} as const;

// Booking Status
export const BOOKING_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  COMPLETED: "completed"
} as const;

export type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];

// Booking Status Colors
export const BOOKING_STATUS_COLORS = {
  [BOOKING_STATUS.PENDING]: "#f5b800",
  [BOOKING_STATUS.ACCEPTED]: "#057642",
  [BOOKING_STATUS.REJECTED]: "#cc1016",
  [BOOKING_STATUS.COMPLETED]: "#0a66c2"
} as const;

// User Roles (same as Trade Categories for now)
export const USER_ROLES = TRADE_CATEGORIES;
export type UserRole = TradeCategory;

// Default User Data
export const DEFAULT_USER = {
  name: "John Doe",
  headline: "Professional",
  location: "",
  bio: "",
  avatarUrl: null,
  profileViews: 0,
  connections: 0,
  roles: ["General"]
} as const;

// Navigation Views
export const NAVIGATION_VIEWS = {
  HOME: "home",
  MY_NETWORK: "mynetwork",
  SERVICE: "service",
  BOOKINGS: "bookings",
  PROFILE: "profile"
} as const;

export type NavigationView = typeof NAVIGATION_VIEWS[keyof typeof NAVIGATION_VIEWS];

// Search Limits
export const SEARCH_LIMITS = {
  MAX_USER_RESULTS: 5,
  MAX_POST_RESULTS: 10
} as const;

// Pagination
export const PAGINATION = {
  POSTS_PER_PAGE: 20,
  COMMENTS_PER_PAGE: 10,
  BOOKINGS_PER_PAGE: 20
} as const;

// Date/Time Formats
export const DATE_FORMATS = {
  SHORT_DATE: { weekday: "short", year: "numeric", month: "short", day: "numeric" },
  LONG_DATE: { weekday: "long", year: "numeric", month: "long", day: "numeric" },
  MONTH_YEAR: { month: "long", year: "numeric" }
} as const;

// LocalStorage Keys
export const STORAGE_KEYS = {
  IS_AUTHENTICATED: "isAuthenticated",
  CURRENT_USER: "currentUser",
  TOKEN: "authToken",
  MY_POSTS: "myPosts",
  POST_COMMENTS: "postComments",
  BOOKINGS: "bookings",
  MY_CONNECTIONS: "myConnections",
  CONNECTION_REQUESTS: "connectionRequests",
  ACTIVE_VIEW: "activeView",
  PROFILE_USER_ID: "profileUserId"
} as const;

// Event Names
export const CUSTOM_EVENTS = {
  NAVIGATE: "navigate",
  VIEW_PROFILE: "viewProfile",
  POSTS_UPDATED: "postsUpdated",
  PROFILE_UPDATED: "profileUpdated",
  BOOKINGS_UPDATED: "bookingsUpdated",
  SIGN_OUT: "signOut",
  OPEN_BOOKING_MODAL: "openBookingModal"
} as const;

// API Endpoints (for future backend integration)
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout"
  },
  USERS: {
    ME: "/api/users/me",
    BY_ID: (id: number) => `/api/users/${id}`,
    SEARCH: "/api/users/search"
  },
  POSTS: {
    ALL: "/api/posts",
    BY_ID: (id: number) => `/api/posts/${id}`,
    BY_USER: (userId: number) => `/api/posts/user/${userId}`,
    MY_POSTS: "/api/posts/me",
    LIKE: (postId: number) => `/api/posts/${postId}/like`
  },
  COMMENTS: {
    BY_POST: (postId: number) => `/api/posts/${postId}/comments`,
    BY_ID: (commentId: number) => `/api/comments/${commentId}`
  },
  BOOKINGS: {
    ALL: "/api/bookings",
    BY_ID: (id: number) => `/api/bookings/${id}`,
    UPDATE_STATUS: (id: number) => `/api/bookings/${id}/status`,
    UPCOMING: "/api/bookings/upcoming"
  },
  CONNECTIONS: {
    ALL: "/api/connections",
    REQUESTS: "/api/connections/requests",
    SEND_REQUEST: "/api/connections/request",
    UPDATE_REQUEST: (id: number) => `/api/connections/request/${id}`,
    REMOVE: (userId: number) => `/api/connections/${userId}`,
    SUGGESTIONS: "/api/connections/suggestions"
  },
  SERVICES: {
    ALL: "/api/services",
    CATEGORIES: "/api/services/categories"
  }
} as const;

// Password Validation Patterns
export const PASSWORD_PATTERNS = {
  HAS_LOWERCASE: /(?=.*[a-z])/,
  HAS_UPPERCASE: /(?=.*[A-Z])/,
  HAS_NUMBER: /(?=.*\d)/,
  HAS_SPECIAL: /(?=.*[@$!%*?&])/
} as const;

// UI Theme Colors
export const THEME_COLORS = {
  PRIMARY: "#0a66c2",
  PRIMARY_DARK: "#004182",
  SUCCESS: "#057642",
  WARNING: "#f5b800",
  ERROR: "#cc1016",
  INFO: "#0a66c2",
  BACKGROUND: "#f3f2ef",
  BORDER: "#e0e0e0",
  TEXT_PRIMARY: "rgba(0, 0, 0, 0.9)",
  TEXT_SECONDARY: "rgba(0, 0, 0, 0.6)"
} as const;

// File Upload Settings
export const FILE_UPLOAD = {
  MAX_AVATAR_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_POST_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  MAX_AVATAR_DIMENSIONS: { width: 400, height: 400 },
  MAX_POST_IMAGE_DIMENSIONS: { width: 2000, height: 2000 }
} as const;

// Rate Limiting (for future implementation)
export const RATE_LIMITS = {
  GENERAL_API: { requests: 100, windowMs: 15 * 60 * 1000 }, // 100 requests per 15 minutes
  SEARCH_API: { requests: 30, windowMs: 60 * 1000 }, // 30 requests per minute
  UPLOAD_API: { requests: 10, windowMs: 60 * 60 * 1000 } // 10 requests per hour
} as const;

// Notification Settings
export const NOTIFICATION_SETTINGS = {
  DURATION: 3000, // 3 seconds
  POSITION: "top-right" as const,
  AUTO_DISMISS: true
} as const;

// Calendar Settings
export const CALENDAR_SETTINGS = {
  WEEKDAYS: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  FIRST_DAY_OF_WEEK: 0 // Sunday
} as const;