export const environment = {
  production: false,
  apiUrl: 'https://job-hunt-mate-api-ebgkgkbafkbjh5be.canadacentral-01.azurewebsites.net/api',
  authConfig: {
    tokenExpiryTime: 3600, // 1 hour in seconds
    refreshTokenExpiryTime: 604800, // 1 week in seconds
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token'
  },
  featureFlags: {
    enablePremiumFeatures: false,
    enableAdvancedAnalytics: false,
    enableCalendarIntegration: false,
    enableMultipleResumes: false,
    enableCustomization: false
  }
};