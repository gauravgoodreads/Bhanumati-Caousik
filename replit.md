# Learningpartners1inc Website

## Overview

A professional coaching and consulting website for Bhanumathi Cousik's career guidance and corporate training services. Built as a modern, responsive React application featuring career counseling services, educational packages, blog content, testimonials, and client engagement tools. The platform serves students, parents, schools, corporations, and working professionals seeking career development and leadership training.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **Styling**: Tailwind CSS with custom design system based on blue/green color palette
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible design
- **Animations**: Framer Motion for smooth transitions and interactive elements
- **State Management**: TanStack Query for server state management and API data fetching
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Express session-based authentication for admin panel access
- **API Design**: RESTful endpoints for CRUD operations on services, packages, blog posts, testimonials, and contact forms

### Database Schema
- **Core Entities**: Services, Packages, Blog Posts, Testimonials, Workshops, Contact Messages
- **Admin System**: Role-based admin users with encrypted password storage using bcryptjs
- **Content Management**: Full CRUD operations for all content types with publishing workflows

### Design System
- **Typography**: Poppins for headings, Inter for body text, Manrope for logo
- **Color Palette**: Navy blue primary (#0D47A1), emerald green secondary (#00796B), with light accent variants
- **Components**: Glassmorphism effects, gradient backgrounds, hover animations, and responsive grid layouts
- **Visual Hierarchy**: Card-based layouts with shadows, spacing units following 4/8/16/24 scale

### Performance Optimizations
- **Build System**: Vite with production optimizations and code splitting
- **Asset Management**: Static asset serving with proper caching headers
- **Database**: Connection pooling with Neon serverless PostgreSQL
- **Client-Side**: React Query for intelligent caching and background refetching

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with @neondatabase/serverless driver
- **Drizzle**: Type-safe ORM with migration system for database schema management

### UI and Design Libraries
- **Radix UI**: Comprehensive primitive components for accessibility and behavior
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Framer Motion**: Animation library for smooth transitions and micro-interactions
- **Lucide React**: Icon system for consistent iconography

### Development Tools
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast bundling for production builds
- **TanStack Query**: Server state management with caching and synchronization

### Authentication and Security
- **bcryptjs**: Password hashing for admin authentication
- **express-session**: Session management for admin panel access
- **connect-pg-simple**: PostgreSQL session store for production sessions

### Future Integrations (Planned)
- **Razorpay**: Payment gateway integration for package purchases
- **Email Service**: Contact form submissions and automated responses
- **Google Drive**: Asset management for images and documents