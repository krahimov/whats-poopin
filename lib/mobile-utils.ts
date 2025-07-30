import React from 'react'

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

// Mobile-safe authentication status
export const useMobileAuth = () => {
  if (isMobileBuild) {
    // For mobile, always assume signed in since auth happens via web app
    return {
      isSignedIn: true,
      user: { id: 'mobile-user' },
      isLoaded: true
    }
  }
  
  // For web, use actual Clerk hook
  try {
    const { useUser } = require('@clerk/nextjs')
    return useUser()
  } catch {
    return { isSignedIn: false, user: null, isLoaded: false }
  }
}

// Mobile-safe components
export const MobileSignInButton: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (isMobileBuild) {
    return React.createElement('button', { 
      onClick: () => console.log('Mobile auth handled by web app') 
    }, children)
  }
  
  try {
    const { SignInButton } = require('@clerk/nextjs')
    return React.createElement(SignInButton, {}, children)
  } catch {
    return React.createElement('button', {}, children)
  }
}

export const MobileUserButton: React.FC = () => {
  if (isMobileBuild) {
    return React.createElement('div', {}, 'User')
  }
  
  try {
    const { UserButton } = require('@clerk/nextjs')
    return React.createElement(UserButton)
  } catch {
    return React.createElement('div', {}, 'User')
  }
} 