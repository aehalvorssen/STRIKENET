import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/navigation";
import Home from "@/pages/home";
import Reporting from "@/pages/reporting";
import Education from "@/pages/education";
import Communities from "@/pages/communities";
import ThankYou from "@/pages/thank-you";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/reporting" component={Reporting} />
      <Route path="/education" component={Education} />
      <Route path="/communities" component={Communities} />
      <Route path="/thank-you" component={ThankYou} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main>
            <Router />
          </main>
          
          {/* Footer */}
          <footer className="bg-foreground text-background py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-4 gap-8">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <svg 
                        viewBox="0 0 100 100" 
                        className="w-4 h-4 text-primary-foreground"
                        fill="currentColor"
                      >
                        <path d="M50 15c-3 0-5 2-5 5v10c0 1 0 2 1 3l8 15c1 2 1 4 0 6l-8 15c-1 1-1 2-1 3v10c0 3 2 5 5 5s5-2 5-5V72c0-1 0-2 1-3l8-15c1-2 1-4 0-6l-8-15c-1-1-1-2-1-3V20c0-3-2-5-5-5z"/>
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold">STRIKENET</h3>
                  </div>
                  <p className="text-background/70 text-sm">
                    Protecting South Florida's ecosystems through community-driven invasive species management.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Quick Links</h4>
                  <ul className="space-y-2 text-sm text-background/70">
                    <li><a href="/" className="hover:text-background transition-colors">Home</a></li>
                    <li><a href="/education" className="hover:text-background transition-colors">Education</a></li>
                    <li><a href="/communities" className="hover:text-background transition-colors">Communities</a></li>
                    <li><a href="/reporting" className="hover:text-background transition-colors">Report</a></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Species</h4>
                  <ul className="space-y-2 text-sm text-background/70">
                    <li>Lionfish</li>
                    <li>Green Iguana</li>
                    <li>Walking Catfish</li>
                    <li>Mayan Cichlid</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Contact</h4>
                  <p className="text-sm text-background/70 mb-2">South Florida, USA</p>
                  <p className="text-sm text-background/70">info@strikenet.org</p>
                </div>
              </div>
              
              <div className="border-t border-background/20 mt-8 pt-8 text-center">
                <p className="text-sm text-background/70">
                  &copy; 2024 STRIKENET. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
