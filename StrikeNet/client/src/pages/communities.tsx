import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Trophy, Target, Shield } from "lucide-react";

export default function CommunitiesPage() {
  const events = [
    {
      id: 1,
      title: "Fishing the King of the Sea",
      description: "Join certified divers in hunting lionfish in the Florida Keys. Learn proper techniques, use provided gear, and help protect our coral reefs from this invasive predator. Event includes safety briefing and lionfish preparation workshop.",
      date: "October 20th, 2025",
      time: "7:00 AM - 4:00 PM",
      location: "Key Largo Marine Park",
      cost: "Free to attend",
      signup: "Pre-registration required",
      participants: "Experienced divers only (certification required)",
      impact: "Last event removed 847 lionfish",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      gradient: "from-blue-500 to-blue-700",
      icon: "🐠",
      testId: "event-lionfish"
    },
    {
      id: 2,
      title: "Igua-no-more Community Roundup",
      description: "Family-friendly iguana removal event in Enchanted Forest Park. Professional wildlife handlers provide training, equipment, and supervision. Help restore native plant habitats while learning about invasive species management.",
      date: "March 13th, 2026", 
      time: "8:00 AM - 2:00 PM",
      location: "Enchanted Forest Park, Homestead",
      cost: "Free to attend",
      signup: "Walk-ins welcome, groups should register",
      participants: "All ages welcome (minors need guardian)",
      impact: "Previous events captured 312 iguanas",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      gradient: "from-green-500 to-emerald-700",
      icon: "🦎",
      testId: "event-iguana"
    },
    {
      id: 3,
      title: "Monthly Catfish Cleanup",
      description: "Regular freshwater fishing event targeting invasive walking catfish in Everglades canals. Bring your own fishing gear or use provided equipment. Learn identification techniques and proper disposal methods.",
      date: "First Saturday of every month",
      time: "6:00 AM - 12:00 PM",
      location: "Multiple Everglades locations",
      cost: "Free to attend",
      signup: "Drop-in event, no registration needed",
      participants: "All skill levels welcome",
      impact: "Monthly average: 156 catfish removed",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      gradient: "from-amber-500 to-orange-700",
      icon: "🐟",
      testId: "event-catfish"
    }
  ];

  const communityStats = [
    {
      icon: Trophy,
      number: "2,847",
      label: "Invasive Species Removed",
      period: "This Year"
    },
    {
      icon: Users,
      number: "463",
      label: "Active Community Members",
      period: "Currently"
    },
    {
      icon: Target,
      number: "23",
      label: "Events Hosted",
      period: "In 2025"
    }
  ];

  return (
    <div className="bg-muted min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-4">COMMUNITY EVENTS</h1>
          <p className="text-lg text-muted-foreground mb-8">Join fellow South Floridians in invasive species management</p>
          
          {/* Community Impact Stats */}
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
            {communityStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20">
                  <CardContent className="p-6 text-center">
                    <IconComponent className="w-8 h-8 mx-auto mb-3 text-primary" />
                    <div className="text-2xl font-bold text-foreground mb-1" data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
                      {stat.number}
                    </div>
                    <div className="text-sm font-medium text-card-foreground">{stat.label}</div>
                    <div className="text-xs text-muted-foreground">{stat.period}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {events.map((event) => (
            <Card key={event.id} className="bg-card shadow-lg overflow-hidden" data-testid={event.testId}>
              <div className={`h-48 bg-gradient-to-br ${event.gradient} relative`}>
                <img 
                  src={event.image}
                  alt={`${event.title} event location`}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${event.gradient}/40`}></div>
                <div className="absolute bottom-4 left-4">
                  <span className="text-2xl">{event.icon}</span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-card-foreground mb-2" data-testid={`title-${event.testId}`}>
                  {event.title}
                </h3>
                <p className="text-muted-foreground mb-4 text-sm" data-testid={`description-${event.testId}`}>
                  {event.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="font-medium text-card-foreground" data-testid={`date-${event.testId}`}>
                      {event.date}
                    </span>
                  </div>
                  
                  {event.time && (
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {event.time}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground" data-testid={`location-${event.testId}`}>
                      {event.location}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {event.participants}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Target className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground font-medium">
                      {event.impact}
                    </span>
                  </div>
                  
                  <div className="pt-2 border-t border-muted text-xs text-muted-foreground">
                    {event.cost} • {event.signup}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Safety Guidelines */}
        <Card className="mt-12 bg-card border-l-4 border-l-primary">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-primary" />
              Safety Guidelines
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-card-foreground mb-2">For All Events:</p>
                <ul className="space-y-1">
                  <li>• Follow all instructions from event coordinators</li>
                  <li>• Use provided safety equipment at all times</li>
                  <li>• Stay hydrated and wear sun protection</li>
                  <li>• Report any injuries immediately</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-card-foreground mb-2">Species-Specific:</p>
                <ul className="space-y-1">
                  <li>• Never handle iguanas or catfish with bare hands</li>
                  <li>• Use proper tools for species removal</li>
                  <li>• Maintain safe distance from wildlife</li>
                  <li>• Follow humane handling practices</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Want to organize an event in your area?</p>
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3"
            data-testid="button-contact-us"
          >
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
}
