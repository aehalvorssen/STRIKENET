import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section className="underwater-hero-bg min-h-screen flex items-center justify-between px-4 sm:px-6 lg:px-8 relative">
      {/* Background overlay for text readability */}
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between h-full">
        {/* Left side - Main Content */}
        <div className="flex-1 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Track and tackle invasive species across South Florida with
            AI-powered reporting and community challenges.
          </h1>
          <p className="text-xl sm:text-2xl text-white font-light mb-8 leading-relaxed">
            Dive in, explore the map, and see how you can make an impact.
          </p>
        </div>

        {/* Right side - CTA Button */}
        <div className="hidden lg:flex flex-1 justify-end items-center">
          <Link href="/reporting">
            <button
              className="border-2 border-white bg-transparent hover:bg-white/10 text-black bg-white/90 hover:bg-white font-semibold px-8 py-4 uppercase tracking-wider transition-all duration-300 transform hover:scale-105"
              data-testid="button-take-me-to-report"
            >
              TAKE ME TO REPORT
            </button>
          </Link>
        </div>

        {/* Mobile CTA - below text on smaller screens */}
        <div className="lg:hidden bottom-8 left-4 right-4">
          <Link href="/reporting">
            <button
              className="w-full border-2 border-white bg-transparent hover:bg-white/10 text-black bg-white/90 hover:bg-white font-semibold px-8 py-4 uppercase tracking-wider transition-all duration-300"
              data-testid="button-take-me-to-report-mobile"
            >
              TAKE ME TO REPORT
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
