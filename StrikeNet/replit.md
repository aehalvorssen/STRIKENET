# STRIKENET - Invasive Species Tracking Platform

## Overview

STRIKENET is a React-based web application designed to track and tackle invasive species across South Florida through AI-powered reporting and community engagement. The platform enables users to report sightings of invasive species, view real-time distribution maps, access educational content, and participate in community events. The system focuses on five key invasive species: Lionfish, Walking Catfish, Mayan Cichlid, Green Iguana, and Egyptian Goose.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with pages for Home, Reporting, Education, Communities, and Thank You
- **UI Components**: Radix UI primitives with shadcn/ui component library providing consistent design system
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form processing
- **Component Structure**: Modular design with reusable UI components, navigation system, and page-specific components

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **API Design**: RESTful API with endpoints for sightings management (GET /api/sightings, POST /api/sightings)
- **File Upload**: Multer middleware for handling image uploads with 10MB size limit
- **Development Server**: Vite middleware integration for hot module replacement in development
- **Error Handling**: Centralized error handling with structured JSON responses

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Design**: 
  - Users table with authentication fields
  - Sightings table with species, location (latitude/longitude), images, AI identification, and verification status
- **Connection**: Neon Database serverless PostgreSQL integration
- **Migration Strategy**: Drizzle Kit for schema migrations and database management
- **Fallback Storage**: In-memory storage implementation for development/testing scenarios

### Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL session store using connect-pg-simple
- **User Management**: Basic user registration and authentication system with password handling
- **Security**: Session-based authentication with secure cookie configuration

### External Dependencies

#### AI and Machine Learning
- **OpenAI Integration**: GPT-5 model for species identification from uploaded images
- **Image Processing**: AI-powered species classification to assist users in identifying invasive species

#### Database and Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting for production data storage
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect configuration

#### Development and Deployment
- **Replit Integration**: 
  - Runtime error overlay for development debugging
  - Cartographer plugin for enhanced development experience
  - Dev banner for development environment indication
- **Build System**: ESBuild for server-side bundling and Vite for client-side optimization

#### UI and Design System
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent iconography
- **shadcn/ui**: Pre-built component library built on Radix UI primitives

#### Geolocation and Mapping
- **Browser Geolocation API**: For capturing user location during sighting reports
- **Interactive Map System**: Visual representation of sighting data with filtering capabilities

#### Form and Validation
- **React Hook Form**: Performance-focused form library with minimal re-renders
- **Zod**: TypeScript-first schema validation for runtime type checking
- **Hookform Resolvers**: Integration between React Hook Form and Zod validation