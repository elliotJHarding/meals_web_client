# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
npm run dev

# Build the project
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

## Architecture Overview

This is a React + TypeScript + Vite meal planning web application that helps users manage meals, create meal plans, and generate shopping lists.

### Core Domain Models

The application is built around several key domain entities in `src/domain/`:

- **Meal**: Central entity with ingredients, recipes, effort levels, prep times, and tags
- **Plan**: Date-specific collection of meals with associated shopping list items
- **MealPlan**: Container class that manages multiple plans with date-based operations
- **Ingredient**: Meal components with quantities and units
- **Recipe**: Optional cooking instructions linked to meals

### Repository Pattern

All API communication follows a repository pattern in `src/repository/`:
- Base `Repository` class handles common HTTP operations with axios
- Specialized repositories (MealRepository, PlanRepository, etc.) extend the base
- All requests include credentials and use consistent error handling

### UI Framework Stack

- **Material-UI (MUI)**: Primary component library with emotion styling
- **Framer Motion**: Animation library for enhanced UX
- **React Router DOM**: Client-side routing
- **Hello Pangea DnD**: Drag and drop functionality for meal planning

### Key Features

1. **Meal Management**: Create, edit, and organize meals with ingredients and recipes
2. **Meal Planning**: Weekly planning interface with drag-and-drop meal assignment
3. **Shopping Lists**: Automatic generation from planned meals
4. **Calendar Integration**: Support for linking external calendar events
5. **Authentication**: Google OAuth integration with JWT tokens

### Component Organization

- `components/meals/`: Meal-related UI components
- `components/plans/`: Meal planning and wizard interfaces
- `components/navbar/`: Navigation with responsive design
- `hooks/`: Custom React hooks for data fetching and state management
- `contexts/`: React context providers (primarily authentication)

### Important Implementation Notes

- Uses custom hooks extensively for API state management
- Authentication context provides app-wide auth state
- Repository classes handle all backend communication
- Domain models are TypeScript interfaces/classes with business logic
- Responsive design with separate NavBarLarge/NavBarSmall components

### Backend Server
This is a webclient for a backend server.
It's relative repository is @~/elliot/IdeaProjects/meals_server
Any changes to the client server interface should consider this repository