import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import "./App.css";
import Login from "./component/login";
import Register from "./component/register";
import { DashboardPage } from "./pages/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
      </BrowserRouter>
  );
}

export default App;
