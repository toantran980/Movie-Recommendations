# Movie Recommendation App

A full-stack movie recommendation application built with React frontend and Node.js/Express backend, powered by The Movie Database (TMDB) API.

## Features

- 🎬 Browse popular movies
- 🔍 Search for movies by title
- ❤️ Add movies to favorites
- 📱 Responsive design
- 🔒 Secure API key management on backend

## Tech Stack

### Frontend

- **React** - UI library
- **Vite** - Build tool and dev server
- **CSS** - Custom styling
- **Context API** - State management

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## Project Structure

```text
Movie-Recommendations/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components
│   │   ├── contexts/   # React Context providers
│   │   ├── services/   # API service functions
│   │   └── css/        # Styling files
│   └── public/         # Static assets
└── backend/            # Express.js backend API
    ├── routes/         # API route handlers
    ├── server.js       # Main server file
    └── .env            # Environment variables
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- TMDB API key (get one at [themoviedb.org](https://www.themoviedb.org/settings/api))

### Installation

1. **Clone the repository**

   ```bash
   git clone <https://github.com/toantran980/Movie-Recommendations.git>
   cd Movie-Rec-React
   ```
2. **Set up the backend**

   ```bash
   cd backend
   npm install
   ```
3. **Set up the frontend**

   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**

   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:5000`
2. **Start the frontend development server**

   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`
3. **Open your browser**

   Navigate to `http://localhost:5173` to use the application
