import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import SpeciesFilter from "./species-filter";
import { Link } from "wouter";
import { type Sighting } from "@shared/schema";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons for different species
const createSpeciesIcon = (species: string) => {
  const colors = {
    'Lionfish': '#ef4444', // red
    'Walking Catfish': '#f97316', // orange
    'Mayan Cichlid': '#eab308', // yellow
    'Green Iguana': '#16a34a', // green
    'Egyptian Goose': '#2563eb', // blue
    'Other': '#6b7280' // gray
  };
  
  const color = colors[species as keyof typeof colors] || colors['Other'];
  
  return L.divIcon({
    className: 'custom-species-marker',
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

// Heatmap layer component
function HeatmapLayer({ sightings }: { sightings: Sighting[] }) {
  const map = useMap();
  
  useEffect(() => {
    // Remove existing heatmap layers
    map.eachLayer((layer) => {
      if ((layer as any)._heat) {
        map.removeLayer(layer);
      }
    });
    
    if (sightings.length > 0) {
      // Convert sightings to heat points [lat, lng, intensity]
      const heatPoints = sightings.map(sighting => {
        const lat = parseFloat(sighting.latitude);
        const lng = parseFloat(sighting.longitude);
        const intensity = (sighting.quantity || 1) * 0.3; // Scale quantity for heat intensity
        return [lat, lng, intensity] as [number, number, number];
      });
      
      // Create heatmap layer
      const heatLayer = L.heatLayer(heatPoints, {
        radius: 25,
        blur: 35,
        maxZoom: 17,
        gradient: {
          0.0: '#313695',
          0.1: '#4575b4', 
          0.2: '#74add1',
          0.4: '#abd9e9',
          0.6: '#fee090',
          0.8: '#fdae61',
          1.0: '#d73027'
        }
      });
      
      map.addLayer(heatLayer);
    }
    
    return () => {
      // Cleanup on unmount
      map.eachLayer((layer) => {
        if ((layer as any)._heat) {
          map.removeLayer(layer);
        }
      });
    };
  }, [map, sightings]);
  
  return null;
}

export default function InteractiveMap() {
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([
    "Lionfish", "Walking Catfish", "Mayan Cichlid", "Green Iguana", "Egyptian Goose"
  ]);
  const [viewMode, setViewMode] = useState<'markers' | 'heatmap'>('markers');

  const { data: sightings = [], isLoading } = useQuery<Sighting[]>({
    queryKey: ['/api/sightings'],
    refetchInterval: 30000, // Refresh every 30 seconds for live updates
  });

  const handleSpeciesToggle = (species: string) => {
    setSelectedSpecies(prev => 
      prev.includes(species) 
        ? prev.filter(s => s !== species)
        : [...prev, species]
    );
  };

  const filteredSightings = sightings.filter(sighting => 
    selectedSpecies.includes(sighting.species)
  );

  // South Florida bounds (roughly from Lake Okeechobee to Key West)
  const bounds = {
    north: 27.0,
    south: 24.5, 
    east: -80.0,
    west: -82.0
  };

  return (
    <section className="map-bg py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">INTERACTIVE INVASIVE SPECIES MAP</h2>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
            Report an invasive species sighting and let our AI confirm what you found — including whether it's invasive and if it's legal to remove.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Map */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden relative">
              {isLoading ? (
                <div className="h-[500px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-muted-foreground">Loading map data...</p>
                  </div>
                </div>
              ) : (
                <>
                  <MapContainer
                    center={[25.7617, -80.1918]} // Miami coordinates
                    zoom={8}
                    style={{ height: '500px', width: '100%' }}
                    className="z-0"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {/* Render markers or heatmap based on view mode */}
                    {viewMode === 'markers' ? (
                      filteredSightings.map((sighting) => {
                        const lat = parseFloat(sighting.latitude);
                        const lng = parseFloat(sighting.longitude);
                        
                        // Only show markers within reasonable South Florida bounds
                        if (lat < bounds.south || lat > bounds.north || lng < bounds.west || lng > bounds.east) {
                          return null;
                        }
                        
                        return (
                          <Marker
                            key={sighting.id}
                            position={[lat, lng]}
                            icon={createSpeciesIcon(sighting.species)}
                          >
                            <Popup>
                              <div className="text-sm">
                                <h3 className="font-bold text-base mb-2">{sighting.species}</h3>
                                <p><strong>Quantity:</strong> {sighting.quantity}</p>
                                <p><strong>Status:</strong> {sighting.isVerified}</p>
                                {sighting.description && (
                                  <p><strong>Description:</strong> {sighting.description}</p>
                                )}
                                <p><strong>Reported:</strong> {new Date(sighting.reportedAt).toLocaleDateString()}</p>
                              </div>
                            </Popup>
                          </Marker>
                        );
                      })
                    ) : (
                      <HeatmapLayer sightings={filteredSightings.filter(sighting => {
                        const lat = parseFloat(sighting.latitude);
                        const lng = parseFloat(sighting.longitude);
                        return lat >= bounds.south && lat <= bounds.north && lng >= bounds.west && lng <= bounds.east;
                      })} />
                    )}
                  </MapContainer>
                </>
              )}
              
              {/* Report button */}
              <div className="absolute bottom-4 left-4 z-10">
                <Link href="/reporting">
                  <button 
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold px-6 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                    data-testid="button-report-from-map"
                  >
                    REPORT!
                  </button>
                </Link>
              </div>
              
              {/* View Mode Toggle */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 z-10">
                <div className="flex gap-1">
                  <button
                    onClick={() => setViewMode('markers')}
                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                      viewMode === 'markers' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                    data-testid="button-markers-view"
                  >
                    Markers
                  </button>
                  <button
                    onClick={() => setViewMode('heatmap')}
                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                      viewMode === 'heatmap' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                    data-testid="button-heatmap-view"
                  >
                    Heatmap
                  </button>
                </div>
              </div>
              
              {/* Sighting count */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 z-10">
                <span className="text-sm font-medium text-foreground" data-testid="text-sighting-count">
                  {filteredSightings.length} sighting{filteredSightings.length !== 1 ? 's' : ''} shown
                </span>
              </div>
            </div>
          </div>
          
          {/* Filter Key */}
          <div className="lg:col-span-1">
            <SpeciesFilter 
              selectedSpecies={selectedSpecies}
              onSpeciesToggle={handleSpeciesToggle}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
