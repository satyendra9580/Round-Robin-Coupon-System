
import React, { useState, useEffect } from 'react';
import { getNextCoupon, claimCoupon } from '../utils/couponUtils';
import { 
  generateUserId, 
  isUserOnCooldown, 
  getCooldownTimeRemaining,
  formatCooldownTime,
  setCouponClaimCookie
} from '../utils/abusePreventionUtils';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

const ClaimForm = ({ onCouponClaimed }) => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [success, setSuccess] = useState(false);
  const [formattedTime, setFormattedTime] = useState('');
  const [error, setError] = useState('');
  
  // Initialize user ID on component mount
  useEffect(() => {
    const id = generateUserId();
    setUserId(id);
    
    // Check if user is on cooldown
    if (isUserOnCooldown(id)) {
      setCooldown(true);
      const remainingTime = getCooldownTimeRemaining(id);
      setCooldownTime(remainingTime);
      setFormattedTime(formatCooldownTime(remainingTime));
    }
  }, []);
  
  // Countdown timer for cooldown
  useEffect(() => {
    if (!cooldown || cooldownTime <= 0) return;
    
    const interval = setInterval(() => {
      setCooldownTime(prev => {
        const newTime = prev - 1000;
        if (newTime <= 0) {
          clearInterval(interval);
          setCooldown(false);
          return 0;
        }
        setFormattedTime(formatCooldownTime(newTime));
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [cooldown, cooldownTime]);
  
  const handleClaimCoupon = async () => {
    if (!userId || cooldown || loading) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Get the next coupon
      const coupon = getNextCoupon();
      
      // Record the claim
      claimCoupon(coupon.id, userId);
      
      // Set cookie to track claim
      setCouponClaimCookie(userId, coupon.id);
      
      // Trigger cooldown
      setCooldown(true);
      setCooldownTime(60 * 60 * 1000); // 1 hour
      setFormattedTime('1 hour');
      
      // Show success state
      setSuccess(true);
      
      // Call the callback
      if (onCouponClaimed) {
        onCouponClaimed(coupon, userId);
      }
      
      // Reset success state after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (error) {
      setError('An error occurred while claiming your coupon. Please try again.');
      console.error('Claim error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div id="claim-coupon" className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-medium mb-4">Claim Your Coupon</h2>
      
      {success ? (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 animate-fade-in text-center mb-6">
          <CheckCircle className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="text-sm font-medium">Your coupon has been claimed successfully!</p>
          <p className="text-xs text-muted-foreground mt-1">Check your claimed coupons section.</p>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 animate-fade-in text-center mb-6">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : cooldown ? (
        <div className="bg-muted border border-border rounded-lg p-4 animate-fade-in text-center mb-6">
          <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium">Coupon claim limit reached</p>
          <p className="text-xs text-muted-foreground mt-1">
            You can claim another coupon in <span className="font-medium">{formattedTime}</span>
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mb-6">
          Claim your exclusive coupon to get great discounts on your next purchase.
        </p>
      )}
      
      <button
        onClick={handleClaimCoupon}
        disabled={loading || cooldown}
        className={`
          w-full py-3 px-4 rounded-lg font-medium text-center relative overflow-hidden
          transition-all duration-300 flex items-center justify-center
          ${(loading || cooldown)
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }
        `}
      >
        {loading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : cooldown ? (
          'Coupon Claimed'
        ) : (
          'Claim Coupon'
        )}
      </button>
      
      <p className="text-xs text-muted-foreground mt-4 text-center">
        You may claim one coupon per hour to ensure fair distribution.
      </p>
    </div>
  );
};

export default ClaimForm;
