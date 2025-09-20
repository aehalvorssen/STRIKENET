import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";

export default function EducationPage() {
  const keyInsights = [
    {
      title: "Regulatory Status",
      items: [
        "Not native to Florida and are classified as an invasive species",
        "Not protected in Florida except by anti-cruelty laws",
        "May be humanely killed on private property year-round with landowner permission",
        "Can be captured and humanely killed year-round without a permit or hunting license on 32 public lands in South Florida"
      ]
    },
    {
      title: "Coloration & Appearance", 
      items: [
        "Large lizards usually green, but may also be brown or nearly black",
        "Some adults turn orange or pink seasonally",
        "Hatchlings and juveniles are typically bright green"
      ]
    },
    {
      title: "Distinctive Features",
      items: [
        "Row of spikes along the neck, back, and upper tail; dark black rings on the tail",
        "Mature males have heavy jowls and a large throat fan (dewlap) that helps repel rivals, warn predators, attract mates, and regulate body temperature"
      ]
    },
    {
      title: "Size & Reproduction",
      items: [
        "Males can exceed 5 ft and weigh up to 17 lb; females reach similar length but rarely exceed 7 lb",
        "Females mature at 2-4 years, mate October-November, and dig extensive tunnel systems to lay 14-76 eggs",
        "Lifespan: up to 10 years in the wild and 19 years in captivity"
      ]
    },
    {
      title: "Habitat & Behavior",
      items: [
        "Live on the ground, in shrubs, or in trees across urban, suburban, and agricultural areas",
        "Strong swimmers that tolerate salt and freshwater and can stay submerged for up to four hours",
        "Active during the day (diurnal) and prefer to bask in sunny areas",
        "Excellent climbers with sharp claws that damage trees and structures"
      ]
    },
    {
      title: "Environmental Impact",
      items: [
        "Destroy native vegetation by eating flowers, fruits, and leaves",
        "Compete with native wildlife for food and nesting sites",
        "Their burrowing damages seawalls, sidewalks, and building foundations",
        "Contaminate water sources and swimming pools with bacteria-laden droppings"
      ]
    },
    {
      title: "Economic Damage",
      items: [
        "Cause thousands of dollars in landscaping damage annually",
        "Infrastructure repair costs from burrowing activities",
        "Pool cleaning and property maintenance expenses",
        "Agricultural crop damage in affected areas"
      ]
    },
    {
      title: "Quick Identification",
      items: [
        "Large size (3-6 feet) distinguishes from native anoles",
        "Prominent spinal crest from head to tail",
        "Orange-pink coloring during breeding season (males)",
        "Black banded tail pattern unique to green iguanas"
      ]
    },
    {
      title: "Best Practices for Removal",
      items: [
        "Contact licensed wildlife removal professionals for large iguanas",
        "Use humane methods - stunning followed by pithing or captive bolt",
        "Remove food sources: fallen fruits, bird feeders, pet food",
        "Install barriers around plants and use iguana-resistant landscaping"
      ]
    }
  ];

  return (
    <div className="bg-background min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Main Education Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Iguana Image */}
          <div className="order-2 lg:order-1">
            <div className="bg-primary p-4 rounded-xl">
              <img 
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Green iguana in natural habitat" 
                className="rounded-lg w-full h-auto"
                data-testid="img-green-iguana"
              />
              <div className="bg-primary text-primary-foreground font-bold text-xl text-center py-2 mt-2">
                GREEN IGUANA
              </div>
            </div>
          </div>
          
          {/* Information */}
          <div className="order-1 lg:order-2">
            <h1 className="text-3xl font-bold text-foreground mb-6">MEET YOUR LOCAL INVADER</h1>
            <p className="text-lg text-foreground mb-6" data-testid="text-iguana-status">
              The Green Iguana is an Invasive Species of South Florida.
            </p>
            
            <div className="space-y-4 mb-8">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Why are they a problem?</h3>
                <p className="text-muted-foreground">
                  Green iguanas cause costly damage by burrowing into structures, destroying native plants, contaminating water sources, and competing with native wildlife. They can carry salmonella and other diseases harmful to humans and pets.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">What can we do together?</h3>
                <p className="text-muted-foreground">
                  Report sightings to help track populations, remove food sources from your property, use iguana-resistant plants, and support professional removal efforts. Early detection and community action are key to controlling their spread.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Did you know?</h3>
                <p className="text-muted-foreground">
                  A single female iguana can lay up to 76 eggs per year, and populations can double in just 2-3 years if left unchecked. They're most active during South Florida's dry season (November-April).
                </p>
              </div>
            </div>
            
            <p className="text-lg font-medium text-foreground mb-4">See one, report one.</p>
            <Link href="/reporting">
              <button 
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6 py-3 rounded-lg transition-all duration-300 border-2 border-accent"
                data-testid="button-report-from-education"
              >
                TAKE ME TO REPORT
              </button>
            </Link>
          </div>
        </div>
        
        {/* Key Insights */}
        <Card className="bg-muted">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">KEY INSIGHTS</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {keyInsights.map((insight, index) => (
                <div key={insight.title}>
                  <h3 className="text-lg font-semibold text-foreground mb-4" data-testid={`heading-${insight.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    {insight.title}
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {insight.items.map((item, itemIndex) => (
                      <li key={itemIndex}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
