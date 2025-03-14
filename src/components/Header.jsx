
import React from 'react';
import { GiftIcon } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-6 px-4 sm:px-6 border-b border-border/40">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2 animate-fade-in">
          <GiftIcon className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-medium">Fair Share</h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <a 
            href="#how-it-works" 
            className="text-foreground/80 hover:text-primary transition-colors duration-200"
          >
            How It Works
          </a>
          <a 
            href="#available-coupons" 
            className="text-foreground/80 hover:text-primary transition-colors duration-200"
          >
            Available Coupons
          </a>
          <a 
            href="#claim-coupon" 
            className="text-foreground/80 hover:text-primary transition-colors duration-200"
          >
            Claim Coupon
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
