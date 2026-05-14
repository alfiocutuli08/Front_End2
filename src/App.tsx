import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./lib/AuthContext";
import { ProtectedRoute } from "./lib/ProtectedRoute";
import SkillProfilePage from "./pages/profiloPersonale";
import ProfiloPubblico from "./pages/profiloPubblico";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { PaginaRicercaPage } from "./pages/PaginaRicercaPage";
import { CardPrincipalePage } from "./pages/CardPrincipalePage";
import HomePages from "./pages/HomePages";
import { DashboardPage } from "./pages/DashboardPage";
import './App.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<HomePages />} />
            <Route path="profilo" element={<ProtectedRoute><SkillProfilePage /></ProtectedRoute>} />
            <Route path="public" element={<ProfiloPubblico />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="search" element={<PaginaRicercaPage />} />
            <Route path="card" element={<CardPrincipalePage />} />
            <Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
