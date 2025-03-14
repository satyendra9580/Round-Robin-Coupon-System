// Cooldown time in milliseconds (1 hour)
const COOLDOWN_TIME = 60 * 60 * 1000;

// Cookie name for tracking
const CLAIM_COOKIE_NAME = 'coupon_claims';

export const generateUserId = () => {
  const userAgent = navigator.userAgent;
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const colorDepth = window.screen.colorDepth;
  const pixelRatio = window.devicePixelRatio;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Combine values and hash them
  const fingerprint = `${userAgent}-${screenWidth}-${screenHeight}-${colorDepth}-${pixelRatio}-${timezone}`;
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return `user_${Math.abs(hash)}`;
};
export const getUserIP = async () => {
  try {
    return "127.0.0.1"; 
  } catch (error) {
    console.error("Error getting IP:", error);
    return null;
  }
};

// Set a cookie to track claims
export const setCouponClaimCookie = (userId, couponId) => {
  const now = new Date().getTime();
  
  // Get existing claims or initialize empty object
  let claims = {};
  const existingClaims = getCookie(CLAIM_COOKIE_NAME);
  
  if (existingClaims) {
    try {
      claims = JSON.parse(existingClaims);
    } catch (e) {
      claims = {};
    }
  }
  
  if (!claims[userId]) {
    claims[userId] = [];
  }
  
  claims[userId].push({
    couponId,
    timestamp: now
  });
  
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30);
  
  setCookie(CLAIM_COOKIE_NAME, JSON.stringify(claims), expiryDate);
};

export const isUserOnCooldown = (userId) => {
  const claimsCookie = getCookie(CLAIM_COOKIE_NAME);
  if (!claimsCookie) {
    return false;
  }
  
  try {
    const claims = JSON.parse(claimsCookie);
    const userClaims = claims[userId];
    
    if (!userClaims || userClaims.length === 0) {
      return false;
    }
    
    // Get the most recent claim timestamp
    const mostRecentClaim = userClaims.reduce((latest, claim) => {
      return claim.timestamp > latest ? claim.timestamp : latest;
    }, 0);
    
    const now = new Date().getTime();
    
    // Check if enough time has passed since the last claim
    return (now - mostRecentClaim) < COOLDOWN_TIME;
  } catch (e) {
    console.error("Error checking cooldown:", e);
    return false;
  }
};

// Get time remaining in cooldown period (in milliseconds)
export const getCooldownTimeRemaining = (userId) => {
  const claimsCookie = getCookie(CLAIM_COOKIE_NAME);
  if (!claimsCookie) {
    return 0;
  }
  
  try {
    const claims = JSON.parse(claimsCookie);
    const userClaims = claims[userId];
    
    if (!userClaims || userClaims.length === 0) {
      return 0;
    }
    
    // Get the most recent claim timestamp
    const mostRecentClaim = userClaims.reduce((latest, claim) => {
      return claim.timestamp > latest ? claim.timestamp : latest;
    }, 0);
    
    const now = new Date().getTime();
    const timeSinceClaim = now - mostRecentClaim;
    
    if (timeSinceClaim >= COOLDOWN_TIME) {
      return 0;
    }
    
    return COOLDOWN_TIME - timeSinceClaim;
  } catch (e) {
    console.error("Error calculating cooldown time:", e);
    return 0;
  }
};

// Format milliseconds to human-readable time
export const formatCooldownTime = (milliseconds) => {
  if (milliseconds <= 0) {
    return "0 minutes";
  }
  
  const minutes = Math.ceil(milliseconds / (60 * 1000));
  
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hour${hours === 1 ? '' : 's'}`;
  }
  
  return `${hours} hour${hours === 1 ? '' : 's'} and ${remainingMinutes} minute${remainingMinutes === 1 ? '' : 's'}`;
};

// Cookie utility functions
function setCookie(name, value, expiryDate) {
  document.cookie = `${name}=${value}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
}

function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}
