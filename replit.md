# MedAI Diagnostic Assistant

## Overview

This is a full-stack medical diagnostic assistance application built with React on the frontend and Express.js on the backend. The application allows users to input their symptoms and receive AI-powered diagnostic suggestions for informational purposes. The system emphasizes that it's not a replacement for professional medical advice.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom medical-themed color palette
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **API Integration**: OpenRouter API for AI diagnostic analysis

### Development Setup
- **Environment**: Replit-optimized with development banner and error overlay
- **Hot Reload**: Vite HMR for frontend, tsx for backend development
- **TypeScript**: Strict type checking across the entire stack

## Key Components

### Database Schema
- **Users Table**: Basic user authentication (currently minimal implementation)
- **Assessments Table**: Stores patient symptom assessments including:
  - Primary and additional symptoms
  - Duration and severity ratings
  - Medical history and demographic information
  - AI response data (stored as JSONB)

### Frontend Components
- **SymptomForm**: Comprehensive form for symptom input with validation
- **DiagnosticResults**: Displays AI analysis results with severity indicators
- **MedicalHistory**: Shows user's previous assessments
- **MedicalTerms**: Educational glossary for medical terminology
- **Header/Sidebar**: Navigation and informational components

### Backend Services
- **Storage Layer**: Abstracted storage interface with in-memory implementation
- **API Routes**: RESTful endpoints for assessment creation and AI diagnosis
- **AI Integration**: OpenRouter API integration for medical analysis

## Data Flow

1. **User Input**: Patient enters symptoms through the comprehensive form
2. **Form Validation**: Client-side validation using Zod schemas
3. **Assessment Creation**: Data sent to backend and stored in database
4. **AI Analysis**: Backend calls OpenRouter API with structured medical prompt
5. **Result Display**: AI response processed and displayed with severity indicators
6. **History Tracking**: All assessments stored for user reference

## External Dependencies

### Core Dependencies
- **Database**: Neon Database (serverless PostgreSQL)
- **AI Service**: OpenRouter API for medical analysis
- **UI Components**: Radix UI primitives for accessibility
- **Icons**: Lucide React for consistent iconography

### Development Dependencies
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first styling
- **ESBuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations handle schema changes

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `OPENROUTER_API_KEY`: API key for AI diagnostic service
- `NODE_ENV`: Environment configuration

### Production Deployment
- Single-command build process creates production-ready artifacts
- Express server serves both API endpoints and static frontend assets
- Database migrations applied via Drizzle Kit

## Changelog
- July 05, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.