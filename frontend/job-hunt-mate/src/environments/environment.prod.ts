export const environment = {
  production: true,
  apiUrl: 'https://api.jobhuntmate.com',  // This should be updated to actual production API URL
  authConfig: {
    tokenExpiryTime: 3600,
    refreshTokenExpiryTime: 604800,
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token'
  }
};