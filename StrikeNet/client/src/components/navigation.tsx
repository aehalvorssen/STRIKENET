import { useState } from "react";
import { Link, useLocation } from "wouter";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const menuItems = [
    { href: "/", label: "Home", testId: "nav-home" },
    { href: "/education", label: "Education", testId: "nav-education" },
    { href: "/communities", label: "Communities", testId: "nav-communities" },
    { href: "/reporting", label: "Report Sighting", testId: "nav-reporting" },
  ];

  const isHomePage = location === "/";
  const navBgClass = isHomePage ? "bg-transparent" : "bg-white/95 backdrop-blur-sm border-b border-border";
  const textClass = isHomePage ? "text-white" : "text-foreground";
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${navBgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and STRIKENET wordmark */}
          <Link href="/" onClick={closeMenu} className="flex items-center space-x-3">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg 
                viewBox="0 0 100 100" 
                className={`w-6 h-6 ${textClass}`}
                fill="currentColor"
              >
                {/* Stylized lionfish icon */}
                <path d="M50 15c-3 0-5 2-5 5v10c0 1 0 2 1 3l8 15c1 2 1 4 0 6l-8 15c-1 1-1 2-1 3v10c0 3 2 5 5 5s5-2 5-5V72c0-1 0-2 1-3l8-15c1-2 1-4 0-6l-8-15c-1-1-1-2-1-3V20c0-3-2-5-5-5z"/>
                <path d="M30 25l15 8c1 1 2 1 3 0l8-4c2-1 4-1 6 0l8 4c1 1 2 1 3 0l15-8c2-1 3-3 2-5s-3-3-5-2l-12 6-6-3c-4-2-8-2-12 0l-6 3-12-6c-2-1-4 0-5 2s0 4 2 5z"/>
                <path d="M30 75l15-8c1-1 2-1 3 0l8 4c2 1 4 1 6 0l8-4c1-1 2-1 3 0l15 8c2 1 4 0 5-2s0-4-2-5l-12-6-6 3c-4 2-8 2-12 0l-6-3-12 6c-2 1-4 0-5 2s0 4 2 5z"/>
              </svg>
            </div>
            <h1 className={`text-xl font-bold ${textClass} tracking-wide uppercase`}>STRIKENET</h1>
          </Link>
          
          {/* Hamburger Menu */}
          <button 
            onClick={toggleMenu}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
            data-testid="button-menu-toggle"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <div 
                className={`w-5 h-0.5 ${textClass} mb-1 transition-all duration-300 ${
                  isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                }`} 
              />
              <div 
                className={`w-5 h-0.5 ${textClass} mb-1 transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : ''
                }`} 
              />
              <div 
                className={`w-5 h-0.5 ${textClass} transition-all duration-300 ${
                  isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`} 
              />
            </div>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} ${isHomePage ? 'bg-black/90 backdrop-blur-sm' : 'bg-white border-t border-border'}`}>
        <div className="px-4 py-2 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className={`block px-3 py-2 ${isHomePage ? 'text-white hover:bg-white/10' : 'text-foreground hover:bg-muted'} rounded-lg transition-colors duration-200 ${
                location === item.href ? (isHomePage ? 'bg-white/10' : 'bg-muted') : ''
              }`}
              data-testid={item.testId}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
