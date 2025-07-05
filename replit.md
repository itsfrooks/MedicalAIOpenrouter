# Deepseek R1 Chatbot

## Overview

This is a simple full-stack chatbot application built with React on the frontend and Express.js on the backend. The application provides a clean chat interface for conversing with Deepseek R1 AI model via OpenRouter API. The chatbot maintains conversation history and provides real-time responses.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with clean, modern chat interface design
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Storage**: In-memory storage for chat messages
- **API Integration**: OpenRouter API with Deepseek R1 model

### Development Setup
- **Environment**: Replit-optimized with development banner and error overlay
- **Hot Reload**: Vite HMR for frontend, tsx for backend development
- **TypeScript**: Strict type checking across the entire stack

## Key Components

### Database Schema
- **Users Table**: Basic user authentication (minimal implementation)
- **Messages Table**: Stores chat messages including:
  - Message content
  - Role (user or assistant)
  - Timestamp

### Frontend Components
- **Chat Interface**: Main chat area with message display and input
- **Message Bubbles**: Styled message containers for user and AI responses
- **Input Form**: Message input with send button and loading states

### Backend Services
- **Storage Layer**: In-memory storage for chat messages
- **API Routes**: RESTful endpoints for message creation and retrieval
- **AI Integration**: OpenRouter API integration with Deepseek R1 model

## Data Flow

1. **User Input**: User types message in chat interface
2. **Message Storage**: User message saved to in-memory storage
3. **AI Request**: Backend calls OpenRouter API with conversation history
4. **AI Response**: Deepseek R1 responds with generated content
5. **Response Storage**: AI response saved to storage
6. **Real-time Update**: Frontend displays both user and AI messages

## External Dependencies

### Core Dependencies
- **AI Service**: OpenRouter API with Deepseek R1 model
- **UI Components**: Radix UI primitives for accessibility
- **Icons**: Lucide React for consistent iconography

### Development Dependencies
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first styling

## API Configuration

### OpenRouter Integration
- **Model**: deepseek/deepseek-r1
- **API Key**: Configured in backend routes
- **Temperature**: 0.7 for balanced creativity
- **Max Tokens**: 2000 for comprehensive responses

## Recent Changes
- July 05, 2025: Converted medical diagnostic app to simple chatbot
- Simplified schema to focus on chat messages
- Implemented clean chat interface with real-time messaging
- Integrated Deepseek R1 via OpenRouter API
- Added conversation history context for better responses

## User Preferences

Preferred communication style: Simple, everyday language.