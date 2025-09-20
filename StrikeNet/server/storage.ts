import { type User, type InsertUser, type Sighting, type InsertSighting, users, sightings } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, and, gte, lte, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Sightings methods
  createSighting(sighting: InsertSighting): Promise<Sighting>;
  getSightings(): Promise<Sighting[]>;
  getSightingsBySpecies(species: string): Promise<Sighting[]>;
  getSightingsInBounds(northEast: { lat: number, lng: number }, southWest: { lat: number, lng: number }): Promise<Sighting[]>;
  updateSightingVerification(id: string, status: string): Promise<Sighting | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createSighting(insertSighting: InsertSighting): Promise<Sighting> {
    const [sighting] = await db
      .insert(sightings)
      .values({
        ...insertSighting,
        latitude: insertSighting.latitude.toString(),
        longitude: insertSighting.longitude.toString(),
        quantity: insertSighting.quantity || 1,
        description: insertSighting.description || null,
        imageUrl: insertSighting.imageUrl || null,
        aiIdentification: insertSighting.aiIdentification || null,
        isVerified: "pending",
        userAgent: insertSighting.userAgent || null,
      })
      .returning();
    return sighting;
  }

  async getSightings(): Promise<Sighting[]> {
    return await db.select().from(sightings).orderBy(desc(sightings.reportedAt));
  }

  async getSightingsBySpecies(species: string): Promise<Sighting[]> {
    return await db
      .select()
      .from(sightings)
      .where(eq(sightings.species, species))
      .orderBy(desc(sightings.reportedAt));
  }

  async getSightingsInBounds(
    northEast: { lat: number, lng: number }, 
    southWest: { lat: number, lng: number }
  ): Promise<Sighting[]> {
    // Convert coordinate bounds for decimal comparison
    const neLatStr = northEast.lat.toString();
    const neLngStr = northEast.lng.toString();
    const swLatStr = southWest.lat.toString();
    const swLngStr = southWest.lng.toString();
    
    return await db
      .select()
      .from(sightings)
      .where(
        and(
          lte(sightings.latitude, neLatStr),
          gte(sightings.latitude, swLatStr),
          lte(sightings.longitude, neLngStr),
          gte(sightings.longitude, swLngStr)
        )
      )
      .orderBy(desc(sightings.reportedAt));
  }

  async updateSightingVerification(id: string, status: string): Promise<Sighting | undefined> {
    const [sighting] = await db
      .update(sightings)
      .set({ isVerified: status })
      .where(eq(sightings.id, id))
      .returning();
    return sighting || undefined;
  }
}

export const storage = new DatabaseStorage();
