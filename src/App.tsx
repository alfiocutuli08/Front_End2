import { BrowserRouter } from "react-router";
import SkillProfilePage from "./pages/profiloPersonale";
import './App.css'

function App() {
  return (
    <>
       <BrowserRouter>
          <SkillProfilePage />
      </BrowserRouter>
    </>
  );
}

export default App
