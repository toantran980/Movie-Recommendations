import "./css/App.css";
import Favorites from "./pages/Favorites";
import Home from "./pages/Home";
import Watchlist from "./pages/Watchlist";
import { Routes, Route } from "react-router-dom";
import { MovieProvider } from "./contexts/MovieContext";
import NavBar from "./components/NavBar";
import Toast from "./components/Toast";

function App() {
  return (
    <MovieProvider>
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/watchlist" element={<Watchlist />} />
        </Routes>
      </main>
      <Toast />
    </MovieProvider>
  );
}

export default App;
