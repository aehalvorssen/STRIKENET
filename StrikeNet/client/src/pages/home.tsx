import HeroSection from "@/components/hero-section";
import InteractiveMap from "@/components/interactive-map";

export default function Home() {
  return (
    <div className="scroll-snap-container">
      <div className="scroll-snap-section">
        <HeroSection />
      </div>
      <div className="scroll-snap-section">
        <InteractiveMap />
      </div>
    </div>
  );
}
