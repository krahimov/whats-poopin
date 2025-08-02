// Utility to check if we're in a mobile build
export const isMobileBuild = process.env.CAPACITOR_BUILD === 'true'

// Get the correct API base URL
export const getApiBaseUrl = () => {
  if (typeof window !== 'undefined' && isMobileBuild) {
    // For mobile builds, use the live web app
    return 'https://whats-poopin-git-dev-karim-rahimovs-projects.vercel.app'
  }
  // For web builds, use relative URLs
  return ''
} 