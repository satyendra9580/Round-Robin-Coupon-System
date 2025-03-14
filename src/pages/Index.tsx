
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import CouponCard from '../components/CouponCard';
import ClaimForm from '../components/ClaimForm';
import { 
  getAllCoupons, 
  getUserClaimedCoupons, 
  initializeCouponSystem 
} from '../utils/couponUtils';
import { 
  generateUserId, 
  isUserOnCooldown 
} from '../utils/abusePreventionUtils';
import { ArrowDown, Info, CheckCircle2, ShieldAlert } from 'lucide-react';

const Index = () => {
  const [userId, setUserId] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [claimedCoupons, setClaimedCoupons] = useState([]);
  const [onCooldown, setOnCooldown] = useState(false);
  
  // Initialize on component mount
  useEffect(() => {
    initializeCouponSystem();
    const id = generateUserId();
    setUserId(id);
    
    // Load coupons
    setAvailableCoupons(getAllCoupons());
    
    // Check if user is on cooldown
    setOnCooldown(isUserOnCooldown(id));
    
    // Load claimed coupons
    if (id) {
      const userCoupons = getUserClaimedCoupons(id);
      setClaimedCoupons(userCoupons);
    }
  }, []);
  
  // Handle successful coupon claim
  const handleCouponClaimed = (coupon, userId) => {
    // Update the user's claimed coupons
    const userCoupons = getUserClaimedCoupons(userId);
    setClaimedCoupons(userCoupons);
    setOnCooldown(true);
  };
  
  // Handle claiming from available coupons list
  const handleClaimAvailableCoupon = (coupon) => {
    // This just redirects to the claim form
    const claimSection = document.getElementById('claim-coupon');
    if (claimSection) {
      claimSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            Fair Distribution System
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6">
            Discover and Claim Exclusive Coupons
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Our round-robin system ensures everyone gets a fair chance to claim great deals.
            No login required, just claim and enjoy!
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <a 
              href="#available-coupons"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Browse Coupons
            </a>
            <a 
              href="#how-it-works"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors"
            >
              How It Works
            </a>
          </div>
          
          <div className="mt-16 animate-float">
            <ArrowDown className="h-6 w-6 mx-auto text-muted-foreground" />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-medium mb-4">How It Works</h2>
            <p className="text-muted-foreground">
              Our coupon system is designed to be fair and prevent abuse while making it easy to claim great deals.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm hover-lift animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Info className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Browse Coupons</h3>
              <p className="text-muted-foreground text-sm">
                Check out our selection of exclusive coupons with various discounts and benefits.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm hover-lift animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Claim Your Coupon</h3>
              <p className="text-muted-foreground text-sm">
                Claim a coupon with a single click. Our system will distribute coupons in a round-robin fashion.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm hover-lift animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <ShieldAlert className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Fair Use Policy</h3>
              <p className="text-muted-foreground text-sm">
                To ensure everyone gets a fair chance, you can claim one coupon per hour from our system.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Available Coupons Section */}
      <section id="available-coupons" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-medium mb-4">Available Coupons</h2>
            <p className="text-muted-foreground">
              Browse through our selection of discount coupons and special offers.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {availableCoupons.map((coupon) => (
              <CouponCard 
                key={coupon.id}
                coupon={coupon}
                onClaim={handleClaimAvailableCoupon}
                disabled={onCooldown}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Claim and Display Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Claim Form */}
            <div className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <ClaimForm onCouponClaimed={handleCouponClaimed} />
            </div>
            
            {/* Your Coupons */}
            <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="bg-card border border-border/50 rounded-xl p-6 h-full shadow-sm">
                <h2 className="text-xl font-medium mb-4">Your Claimed Coupons</h2>
                
                {claimedCoupons.length > 0 ? (
                  <div className="space-y-4">
                    {claimedCoupons.map((coupon) => (
                      <CouponCard 
                        key={`claimed-${coupon.id}`}
                        coupon={coupon}
                        claimed={true}
                        claimedAt={coupon.claimedAt}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px] text-center">
                    <p className="text-muted-foreground mb-4">
                      You haven't claimed any coupons yet.
                    </p>
                    <a 
                      href="#claim-coupon" 
                      className="text-primary underline hover:text-primary/80 transition-colors"
                    >
                      Claim your first coupon now
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Fair Share Coupon System. All rights reserved.</p>
          <p className="mt-1">Designed to ensure equitable distribution of coupons.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
