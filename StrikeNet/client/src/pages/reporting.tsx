import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { z } from "zod";
import { insertSightingSchema, type InsertSighting } from "@shared/schema";
import { INVASIVE_SPECIES } from "@/lib/species";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, MapPin, Camera } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

type FormData = {
  species: string;
  latitude: number;
  longitude: number;
  quantity: number;
  description: string;
  locationType: "current" | "pin" | "manual";
  manualAddress: string;
};

export default function ReportingPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const form = useForm<FormData>({
    resolver: zodResolver(insertSightingSchema.extend({
      locationType: z.enum(["current", "pin", "manual"]),
      manualAddress: z.string().optional(),
    })),
    defaultValues: {
      species: "",
      quantity: 1,
      description: "",
      locationType: "current",
      manualAddress: "",
      latitude: 25.7617, // Default to Miami coordinates
      longitude: -80.1918,
    },
  });

  const reportMutation = useMutation({
    mutationFn: async (data: { formValues: FormData; image?: File }) => {
      const formDataToSend = new FormData();
      
      const sightingData = {
        species: data.formValues.species,
        latitude: data.formValues.latitude,
        longitude: data.formValues.longitude,
        quantity: data.formValues.quantity,
        description: data.formValues.description,
      };

      console.log("Sighting data to send:", sightingData);
      formDataToSend.append('data', JSON.stringify(sightingData));
      
      if (data.image) {
        formDataToSend.append('image', data.image);
      }

      // Use fetch directly for FormData instead of apiRequest
      const response = await fetch('/api/sightings', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${response.status}: ${errorText}`);
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/sightings'] });
      form.reset();
      setSelectedFile(null);
      setPreviewUrl(null);
      setLocation("/thank-you");
    },
    onError: (error) => {
      toast({
        title: "Error Reporting Sighting",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
        form.setValue("latitude", latitude);
        form.setValue("longitude", longitude);
        setIsGettingLocation(false);
        toast({
          title: "Location obtained",
          description: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
        });
      },
      (error) => {
        setIsGettingLocation(false);
        toast({
          title: "Location error",
          description: "Could not get your current location",
          variant: "destructive",
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const processFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const onSubmit = (data: FormData) => {
    console.log("Form submission data:", data);
    
    // Create a copy of the data to avoid mutating the original
    const submitData = { ...data };
    
    // Handle location data based on selected method
    if (submitData.locationType === "current") {
      if (currentLocation) {
        // Use the actual current location
        submitData.latitude = currentLocation.lat;
        submitData.longitude = currentLocation.lng;
      } else {
        // Default to Miami coordinates if geolocation fails
        submitData.latitude = 25.7617;
        submitData.longitude = -80.1918;
        toast({
          title: "Using default location",
          description: "Using Miami area coordinates as fallback for current location",
        });
      }
    } else if (submitData.locationType === "pin") {
      // For pin mode, use default coordinates for now (pin clicking not implemented yet)
      submitData.latitude = 25.7617;
      submitData.longitude = -80.1918;
      toast({
        title: "Using default location",
        description: "Using Miami area coordinates for pin location (pin dropping not yet implemented)",
      });
    } else if (submitData.locationType === "manual") {
      // For manual mode, always use Miami coordinates as fallback
      submitData.latitude = 25.7617;
      submitData.longitude = -80.1918;
      
      if (submitData.manualAddress) {
        toast({
          title: "Using approximate location",
          description: `Using Miami area coordinates for address: ${submitData.manualAddress}`,
        });
      } else {
        toast({
          title: "Using default location",
          description: "Using Miami area coordinates for manual entry",
        });
      }
    }

    console.log("Final data before submission:", submitData);

    reportMutation.mutate({
      formValues: submitData,
      image: selectedFile || undefined,
    });
  };

  return (
    <div className="reporting-bg min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">REPORT A SIGHTING</h1>
          <p className="text-xl text-orange-100">Help protect South Florida by sharing what you found.</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Map */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Current Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center mb-4">
                {currentLocation ? (
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Lat: {currentLocation.lat.toFixed(4)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Lng: {currentLocation.lng.toFixed(4)}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Location will appear here</p>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Interactive location map for precise positioning</p>
            </CardContent>
          </Card>
          
          {/* Form */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Species Selection */}
                <div>
                  <Label htmlFor="species" className="text-foreground font-medium">What did you spot?</Label>
                  <p className="text-sm text-muted-foreground mb-3">If unsure, upload a photo for AI identification</p>
                  <Select 
                    value={form.watch("species")} 
                    onValueChange={(value) => {
                      form.setValue("species", value);
                      form.trigger("species"); // Trigger validation
                    }}
                  >
                    <SelectTrigger data-testid="select-species">
                      <SelectValue placeholder="Select the invasive species from the dropdown" />
                    </SelectTrigger>
                    <SelectContent>
                      {INVASIVE_SPECIES.map((species) => (
                        <SelectItem key={species} value={species}>
                          {species}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Photo Upload */}
                <div>
                  <Label className="text-foreground font-medium">Upload a photo</Label>
                  <div 
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/50 hover:bg-muted/70 transition-colors duration-200 cursor-pointer"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                    data-testid="dropzone-image-upload"
                  >
                    {previewUrl ? (
                      <div>
                        <img src={previewUrl} alt="Preview" className="max-h-32 mx-auto mb-2 rounded" />
                        <p className="text-sm text-muted-foreground">{selectedFile?.name}</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Drop files or upload from device</p>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      data-testid="input-file-upload"
                    />
                  </div>
                </div>
                
                {/* Quantity */}
                <div>
                  <Label htmlFor="quantity" className="text-foreground font-medium">Approximately how many did you see?</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    placeholder="Type your answer..."
                    {...form.register("quantity", { valueAsNumber: true })}
                    data-testid="input-quantity"
                  />
                </div>
                
                {/* Location Options */}
                <div>
                  <Label className="text-foreground font-medium mb-2 block">Tell us where you found it</Label>
                  <RadioGroup
                    value={form.watch("locationType")}
                    onValueChange={(value: "current" | "pin" | "manual") => {
                      form.setValue("locationType", value);
                      if (value === "current") {
                        getCurrentLocation();
                      }
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="current" id="current" />
                      <Label htmlFor="current" className="flex items-center gap-2">
                        Use my current location
                        {isGettingLocation && (
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        )}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pin" id="pin" />
                      <Label htmlFor="pin">Drop a pin on map</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="manual" id="manual" />
                      <Label htmlFor="manual">OR enter manually</Label>
                    </div>
                  </RadioGroup>
                  
                  {form.watch("locationType") === "manual" && (
                    <Input
                      placeholder="Enter address or coordinates"
                      className="mt-2"
                      {...form.register("manualAddress")}
                      data-testid="input-manual-location"
                    />
                  )}
                </div>
                
                {/* Description */}
                <div>
                  <Label htmlFor="description" className="text-foreground font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground mb-2">Or leave blank and AI will fill it from uploaded media</p>
                  <Textarea
                    id="description"
                    rows={4}
                    className="resize-none"
                    placeholder="Describe what you observed..."
                    {...form.register("description")}
                    data-testid="textarea-description"
                  />
                </div>
                
                {/* Submit */}
                <Button 
                  type="submit" 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 transition-all duration-300 transform hover:scale-[1.02]"
                  disabled={reportMutation.isPending}
                  data-testid="button-submit-report"
                >
                  {reportMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Submitting Report...
                    </>
                  ) : (
                    "Submit Report"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
