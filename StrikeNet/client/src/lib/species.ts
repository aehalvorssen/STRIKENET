export const INVASIVE_SPECIES = [
  "Lionfish",
  "Walking Catfish", 
  "Mayan Cichlid",
  "Green Iguana",
  "Egyptian Goose",
  "Other"
] as const;

export type InvasiveSpecies = typeof INVASIVE_SPECIES[number];

export const SPECIES_INFO = {
  "Lionfish": {
    category: "Water Creatures",
    color: "red",
    icon: "🐠",
    description: "Venomous predator fish threatening native reef ecosystems"
  },
  "Walking Catfish": {
    category: "Water Creatures", 
    color: "orange",
    icon: "🐟",
    description: "Air-breathing fish that can survive on land and spread rapidly"
  },
  "Mayan Cichlid": {
    category: "Water Creatures",
    color: "yellow", 
    icon: "🐟",
    description: "Aggressive freshwater fish competing with native species"
  },
  "Green Iguana": {
    category: "Reptiles and Amphibians",
    color: "green",
    icon: "🦎", 
    description: "Large herbivorous lizard causing property and ecosystem damage"
  },
  "Egyptian Goose": {
    category: "Birds",
    color: "blue",
    icon: "🦆",
    description: "Aggressive waterfowl displacing native bird species"
  },
  "Other": {
    category: "Unknown",
    color: "gray",
    icon: "❓",
    description: "Other potentially invasive species"
  }
};

export const getSpeciesMarkerClass = (species: string) => {
  const key = species.toLowerCase().replace(/\s+/g, '-');
  return `species-marker-${key}`;
};

export const getSpeciesColor = (species: InvasiveSpecies) => {
  return SPECIES_INFO[species]?.color || "gray";
};
