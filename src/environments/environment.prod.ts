export const environment = {
  production: true,
  apiBaseUrl: 'https://api.yourdomain.com/api',
  enableMockApi: false,
  appName: 'Admin Dashboard',
  appVersion: '1.0.0',
  features: {
    enableAnalytics: true,
    enableNotifications: true,
    enableDarkMode: true,
    enableMultiLanguage: true
  },
  auth: {
    tokenExpirationTime: 86400000, // 24 hours in milliseconds
    refreshTokenExpirationTime: 604800000, // 7 days in milliseconds
    loginRedirectUrl: '/dashboard',
    logoutRedirectUrl: '/login'
  },
  api: {
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000 // 1 second
  },
  logging: {
    level: 'error',
    enableConsoleLogging: false,
    enableRemoteLogging: true
  },
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
    pageSizeOptions: [10, 25, 50, 100]
  }
};