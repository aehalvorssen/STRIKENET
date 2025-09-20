import { SPECIES_INFO, type InvasiveSpecies } from "@/lib/species";

interface SpeciesFilterProps {
  selectedSpecies: string[];
  onSpeciesToggle: (species: string) => void;
}

export default function SpeciesFilter({ selectedSpecies, onSpeciesToggle }: SpeciesFilterProps) {
  const categories = {
    "Water Creatures": ["Lionfish", "Walking Catfish", "Mayan Cichlid"],
    "Reptiles and Amphibians": ["Green Iguana"],
    "Birds": ["Egyptian Goose"]
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Water Creatures":
        return "text-red-600";
      case "Reptiles and Amphibians":
        return "text-green-600";
      case "Birds":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Water Creatures":
        return "🌊";
      case "Reptiles and Amphibians":
        return "🦎";
      case "Birds":
        return "🦅";
      default:
        return "❓";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-foreground mb-4">KEY</h3>
      
      {Object.entries(categories).map(([category, species]) => (
        <div key={category} className="mb-6">
          <h4 className={`font-semibold mb-3 flex items-center ${getCategoryColor(category)}`}>
            <span className="mr-2">{getCategoryIcon(category)}</span>
            {category}
          </h4>
          <ul className="space-y-2">
            {species.map((speciesName) => {
              const info = SPECIES_INFO[speciesName as InvasiveSpecies];
              const isSelected = selectedSpecies.includes(speciesName);
              
              return (
                <li key={speciesName} className="flex items-center text-sm">
                  <button
                    onClick={() => onSpeciesToggle(speciesName)}
                    className={`flex items-center w-full p-1 rounded hover:bg-muted transition-colors ${
                      isSelected ? 'bg-muted' : ''
                    }`}
                    data-testid={`filter-${speciesName.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div 
                      className={`w-3 h-3 rounded-full mr-2 species-marker-${speciesName.toLowerCase().replace(/\s+/g, '-')} ${
                        isSelected ? 'ring-2 ring-offset-1 ring-gray-400' : ''
                      }`}
                    />
                    <span className={isSelected ? 'font-medium' : ''}>{speciesName}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      
      <div className="mt-6 pt-4 border-t border-border">
        <button
          onClick={() => {
            const allSpecies = Object.values(categories).flat();
            if (selectedSpecies.length === allSpecies.length) {
              // If all are selected, deselect all
              allSpecies.forEach(species => onSpeciesToggle(species));
            } else {
              // Otherwise select all
              allSpecies.forEach(species => {
                if (!selectedSpecies.includes(species)) {
                  onSpeciesToggle(species);
                }
              });
            }
          }}
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          data-testid="button-toggle-all-species"
        >
          {selectedSpecies.length === Object.values(categories).flat().length ? "Deselect All" : "Select All"}
        </button>
      </div>
    </div>
  );
}
