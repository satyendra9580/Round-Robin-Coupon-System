
import React from 'react';
import { Ticket, Clock } from 'lucide-react';

const CouponCard = ({ 
  coupon, 
  claimed = false, 
  claimedAt = null,
  onClaim = null,
  disabled = false 
}) => {
  const formattedDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div 
      className={`
        relative overflow-hidden rounded-xl p-6 
        hover-lift transition-all duration-300
        ${claimed 
          ? 'bg-muted/50 border border-border/50' 
          : 'bg-card border border-border/50 shadow-sm'
        }
      `}
    >
      <div className="absolute -top-8 -right-8 w-16 h-16 bg-primary/5 rounded-full"></div>
      <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-primary/5 rounded-full"></div>
      
      <div className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-4
        ${claimed ? 'bg-muted-foreground/10 text-muted-foreground' : 'bg-primary/10 text-primary'}
      `}>
        <Ticket className="mr-1 h-3 w-3" />
        {claimed ? 'Claimed' : 'Available'}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-medium tracking-tight">{coupon.discount}</h3>
        <p className="text-sm text-muted-foreground">{coupon.description}</p>
        
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Coupon Code</p>
              <p className="font-mono text-sm tracking-wider">{coupon.code}</p>
            </div>
            
            {onClaim && !claimed && (
              <button
                onClick={() => onClaim(coupon)}
                disabled={disabled}
                className={`
                  px-4 py-2 text-sm font-medium rounded-lg
                  transition-all duration-200
                  ${disabled 
                    ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'}
                `}
              >
                Claim
              </button>
            )}
            
            {claimed && claimedAt && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>{formattedDate(claimedAt)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-muted-foreground">
        Expires: {coupon.expiry}
      </div>
    </div>
  );
};

export default CouponCard;
