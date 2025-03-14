
// A set of sample coupons for demonstration
const COUPONS = [
  { 
    id: 'SAVE20', 
    code: 'SAVE20NOW', 
    discount: '20% off', 
    description: 'Get 20% off your entire purchase',
    expiry: '2025-12-31' 
  },
  { 
    id: 'FREE10', 
    code: 'FREEDEL10', 
    discount: 'Free delivery', 
    description: 'Free delivery on orders over $10',
    expiry: '2025-12-31' 
  },
  { 
    id: 'HALF50', 
    code: 'HALF50NOW', 
    discount: '50% off', 
    description: 'Half price on selected items',
    expiry: '2025-12-31' 
  },
  { 
    id: 'BUY1GET1', 
    code: 'BOGOFREE', 
    discount: 'Buy one get one free', 
    description: 'Purchase one item and get another for free',
    expiry: '2025-12-31' 
  },
  { 
    id: 'EXTRA15', 
    code: 'EXTRA15NOW', 
    discount: 'Extra 15% off', 
    description: 'Take an extra 15% off sale items',
    expiry: '2025-12-31' 
  }
];

// Track claimed coupons and which index to serve next
let claimedCoupons = [];
let nextCouponIndex = 0;

// Get all available coupons
export const getAllCoupons = () => {
  return COUPONS;
};

// Get the next coupon in the round-robin sequence
export const getNextCoupon = () => {
  const coupon = COUPONS[nextCouponIndex];
  nextCouponIndex = (nextCouponIndex + 1) % COUPONS.length;
  return coupon;
};

// Record a claimed coupon
export const claimCoupon = (couponId, userId) => {
  const timestamp = new Date().getTime();
  claimedCoupons.push({
    couponId,
    userId,
    timestamp
  });
  
  // Store in local storage for persistence across page refreshes
  const storedClaims = JSON.parse(localStorage.getItem('claimedCoupons') || '[]');
  storedClaims.push({
    couponId,
    userId,
    timestamp
  });
  localStorage.setItem('claimedCoupons', JSON.stringify(storedClaims));
  
  return true;
};

// Get a user's claimed coupons
export const getUserClaimedCoupons = (userId) => {
  const storedClaims = JSON.parse(localStorage.getItem('claimedCoupons') || '[]');
  const userClaims = storedClaims.filter(claim => claim.userId === userId);
  
  return userClaims.map(claim => {
    const coupon = COUPONS.find(c => c.id === claim.couponId);
    return {
      ...coupon,
      claimedAt: claim.timestamp
    };
  });
};

// Initialize from local storage on page load
export const initializeCouponSystem = () => {
  const storedClaims = JSON.parse(localStorage.getItem('claimedCoupons') || '[]');
  claimedCoupons = storedClaims;
};
