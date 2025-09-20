interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
        <svg 
          viewBox="0 0 100 100" 
          className="w-6 h-6 text-primary-foreground"
          fill="currentColor"
        >
          {/* Stylized lionfish icon based on the logo */}
          <path d="M50 15c-3 0-5 2-5 5v10c0 1 0 2 1 3l8 15c1 2 1 4 0 6l-8 15c-1 1-1 2-1 3v10c0 3 2 5 5 5s5-2 5-5V72c0-1 0-2 1-3l8-15c1-2 1-4 0-6l-8-15c-1-1-1-2-1-3V20c0-3-2-5-5-5z"/>
          <path d="M30 25l15 8c1 1 2 1 3 0l8-4c2-1 4-1 6 0l8 4c1 1 2 1 3 0l15-8c2-1 3-3 2-5s-3-3-5-2l-12 6-6-3c-4-2-8-2-12 0l-6 3-12-6c-2-1-4 0-5 2s0 4 2 5z"/>
          <path d="M30 75l15-8c1-1 2-1 3 0l8 4c2 1 4 1 6 0l8-4c1-1 2-1 3 0l15 8c2 1 4 0 5-2s0-4-2-5l-12-6-6 3c-4 2-8 2-12 0l-6-3-12 6c-2 1-4 0-5 2s0 4 2 5z"/>
        </svg>
      </div>
    </div>
  );
}
