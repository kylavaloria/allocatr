import React from 'react';
import { User } from 'lucide-react';
import logoSrc from '../../assets/images/logo.png'; // Make sure this path is correct

/**
 * Renders the main application header.
 * Based on the design in image_2cdf9f.png.
 *
 */
const Header = () => {
  // Assuming "Resources" is the active page for this view
  const activeLinkClasses = "text-primary-dark font-medium border-b-2 border-primary pb-1"; //
  const inactiveLinkClasses = "text-gray-300 hover:text-primary-dark transition-colors pb-1"; //

  return (
    <header className="bg-white border-b border-gray-200 w-full font-sans">
      <div className="max-w-screen-xl mx-auto px-6 h-20 flex justify-between items-center">

        {/* Logo/Brand Name */}
        <div className="flex items-center gap-3 text-primary-dark">
          {/* Logo Image */}
          <img
            src={logoSrc}
            alt="Allocatr Logo"
            className="h-12 w-auto" // Adjusted height slightly
          />

          {/* Wrapper for Brand + Tagline */}
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary leading-tight">allocatr</span>
            <span className="text-xs text-primary font-medium tracking-wide">
              Operations Resource Tracker
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
