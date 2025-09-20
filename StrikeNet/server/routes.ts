import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSightingSchema } from "@shared/schema";
import { ZodError } from "zod";
import OpenAI from "openai";
import multer from "multer";
import { Buffer } from "buffer";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

// Configure multer for handling file uploads in memory
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all sightings
  app.get("/api/sightings", async (req, res) => {
    try {
      const { species, bounds } = req.query;
      
      let sightings;
      if (species && typeof species === "string") {
        sightings = await storage.getSightingsBySpecies(species);
      } else if (bounds && typeof bounds === "string") {
        const boundsData = JSON.parse(bounds);
        sightings = await storage.getSightingsInBounds(boundsData.northEast, boundsData.southWest);
      } else {
        sightings = await storage.getSightings();
      }
      
      res.json(sightings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sightings" });
    }
  });

  // Create new sighting with optional image analysis
  app.post("/api/sightings", upload.single('image'), async (req, res) => {
    try {
      let sightingData = req.body;
      
      // Parse JSON data if it comes as form data
      if (typeof sightingData.data === 'string') {
        sightingData = JSON.parse(sightingData.data);
      }

      // Convert string coordinates to numbers
      if (typeof sightingData.latitude === 'string') {
        sightingData.latitude = parseFloat(sightingData.latitude);
      }
      if (typeof sightingData.longitude === 'string') {
        sightingData.longitude = parseFloat(sightingData.longitude);
      }
      if (typeof sightingData.quantity === 'string') {
        sightingData.quantity = parseInt(sightingData.quantity);
      }

      // Validate the data
      const validatedData = insertSightingSchema.parse(sightingData);
      
      let aiIdentification = null;
      let imageUrl = null;
      
      // Process uploaded image if present
      if (req.file) {
        try {
          // Convert image to base64
          const base64Image = req.file.buffer.toString('base64');
          
          // Use OpenAI Vision API to identify the species
          const visionResponse = await openai.chat.completions.create({
            model: "gpt-5",
            messages: [
              {
                role: "system",
                content: "You are an expert marine biologist and invasive species specialist focusing on South Florida. Analyze the image and determine if it shows one of these invasive species: Lionfish, Walking Catfish, Mayan Cichlid, Green Iguana, or Egyptian Goose. Respond with JSON in this format: { 'species': 'species_name_or_unknown', 'confidence': number_0_to_1, 'isInvasive': boolean, 'description': 'detailed_description', 'recommendations': 'what_to_do_if_found' }"
              },
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: "Please identify this species and determine if it's invasive to South Florida. Focus on the key identifying features."
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: `data:image/${req.file.mimetype.split('/')[1]};base64,${base64Image}`
                    }
                  }
                ],
              },
            ],
            response_format: { type: "json_object" },
            max_completion_tokens: 1000,
          });

          aiIdentification = visionResponse.choices[0].message.content;
          
          // In a production app, you'd upload the image to cloud storage
          // For now, we'll store it as a data URL (not recommended for production)
          imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;
          
        } catch (aiError) {
          console.error("AI analysis failed:", aiError);
          // Continue without AI analysis
        }
      }

      // Create the sighting
      const sighting = await storage.createSighting({
        ...validatedData,
        aiIdentification,
        imageUrl,
        userAgent: req.headers['user-agent'] || null,
      });

      res.status(201).json(sighting);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ 
          error: "Invalid sighting data", 
          details: error.errors 
        });
      } else {
        console.error("Sighting creation error:", error);
        res.status(500).json({ error: "Failed to create sighting" });
      }
    }
  });

  // Update sighting verification status
  app.patch("/api/sightings/:id/verify", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!["pending", "confirmed", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Invalid verification status" });
      }
      
      const sighting = await storage.updateSightingVerification(id, status);
      
      if (!sighting) {
        return res.status(404).json({ error: "Sighting not found" });
      }
      
      res.json(sighting);
    } catch (error) {
      res.status(500).json({ error: "Failed to update sighting" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
