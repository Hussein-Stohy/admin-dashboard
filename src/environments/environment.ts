export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000/api',
  enableMockApi: true,
  appName: 'Admin Dashboard',
  appVersion: '1.0.0',
  features: {
    enableAnalytics: true,
    enableNotifications: true,
    enableDarkMode: true,
    enableMultiLanguage: false
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
    level: 'debug',
    enableConsoleLogging: true,
    enableRemoteLogging: false
  },
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
    pageSizeOptions: [10, 25, 50, 100]
  }
};