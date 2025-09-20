import { useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function ThankYouPage() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="bg-muted min-h-screen pt-16 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-card shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-card-foreground mb-2" data-testid="heading-thank-you">
                Thank you for your report!
              </h1>
              <p className="text-muted-foreground" data-testid="text-processing-message">
                We are processing the data and updating our servers.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span data-testid="text-redirect-notice">Redirecting to home page in 3 seconds...</span>
              </div>
              
              <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full animate-pulse"
                  style={{ 
                    width: "0%",
                    animation: "progressBar 3s linear forwards"
                  }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <style>{`
        @keyframes progressBar {
          from { width: 0% }
          to { width: 100% }
        }
      `}</style>
    </div>
  );
}