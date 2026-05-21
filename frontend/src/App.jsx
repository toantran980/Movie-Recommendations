import "./css/App.css";
import Favorites from "./pages/Favorites";
import Home from "./pages/Home";
import Watchlist from "./pages/Watchlist";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Routes, Route } from "react-router-dom";
import { MovieProvider } from "./contexts/MovieContext";
import { AuthProvider } from "./contexts/AuthProvider";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import Toast from "./components/Toast";

function App() {
  return (
    <AuthProvider>
      <MovieProvider>
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/favorites"
              element={<ProtectedRoute><Favorites /></ProtectedRoute>}
            />
            <Route
              path="/watchlist"
              element={<ProtectedRoute><Watchlist /></ProtectedRoute>}
            />
          </Routes>
        </main>
        <Toast />
      </MovieProvider>
    </AuthProvider>
  );
}

export default App;
