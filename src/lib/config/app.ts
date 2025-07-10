/**
 * Application configuration constants
 */

export const APP_CONFIG = {
  name: 'Portfolio Analysis',
  version: '1.0.0',
  description: 'Professional trading portfolio analysis platform',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'),
  timeout: 30000,
  retries: 3,
} as const;

export const DHAN_CONFIG = {
  baseUrl: process.env.DHAN_BASE_URL || 'https://api.dhan.co/v2',
  accessToken: process.env.DHAN_ACCESS_TOKEN,
  clientId: process.env.DHAN_CLIENT_ID,
} as const;

export const DATABASE_CONFIG = {
  url: process.env.DATABASE_URL,
} as const;

export const AUTH_CONFIG = {
  secret: process.env.NEXTAUTH_SECRET,
  sessionMaxAge: 30 * 24 * 60 * 60, // 30 days
} as const;

export const ENVIRONMENT = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const;
