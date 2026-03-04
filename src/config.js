/**
 * Backend API base URL (no trailing slash).
 * When running on localhost, use local backend to avoid CORS with Azure.
 * In production build, uses REACT_APP_API_URL.
 */
export const getApiUrl = () => {
  if (typeof window !== 'undefined' && window.location.origin.includes('localhost')) {
    return 'http://localhost:8080';
  }
  return process.env.REACT_APP_API_URL || 'http://localhost:8080';
};
