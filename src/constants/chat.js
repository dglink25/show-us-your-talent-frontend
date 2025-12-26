// src/constants/chat.js
export const CHAT_PALETTE = {
  primary: '#667eea',
  primaryDark: '#5a67d8',
  primaryLight: '#7c9eff',
  secondary: '#764ba2',
  success: '#48bb78',
  warning: '#ed8936',
  danger: '#f56565',
  light: '#f7fafc',
  dark: '#2d3748',
  gray: '#a0aec0',
  white: '#ffffff',
  black: '#000000',
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  gradientLight: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  gradientDark: 'linear-gradient(135deg, #4c6ef5 0%, #5c3fa0 100%)',
};

export const CHAT_SETTINGS = {
  refreshInterval: 30000, // 30 secondes
  typingTimeout: 2000, // 2 secondes
  maxMessageLength: 1000,
  maxFileSize: 5 * 1024 * 1024, // 5MB
};

export const CHAT_ROLES = {
  PROMOTEUR: 'promoteur',
  CANDIDAT: 'candidat',
  ADMIN: 'admin',
  JURY: 'jury',
};