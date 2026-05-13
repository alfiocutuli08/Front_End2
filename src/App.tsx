import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import { CardPrincipalePage } from "./pages/CardPrincipalePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CardPrincipalePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
