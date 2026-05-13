import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import { CardPrincipalePage } from "./pages/CardPrincipalePage";
import { PaginaRicercaPage } from "./pages/PaginaRicercaPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CardPrincipalePage />} />
        <Route path="/paginaricerca" element={<PaginaRicercaPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
