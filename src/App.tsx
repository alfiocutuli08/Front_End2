import { BrowserRouter, Route, Routes } from "react-router";
import SkillProfilePage from "./pages/profiloPersonale";
import ProfiloPubblico from "./pages/profiloPubblico";
import './App.css'

function App() {
  return (
    <>
       <BrowserRouter>
        <Routes>
          <Route path="profile">
            <Route index element={<SkillProfilePage />} />
            <Route path="public" element={<ProfiloPubblico />} />
          </Route>
          <Route path="/" element={<ProfiloPubblico />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
