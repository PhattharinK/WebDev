import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import LoginScreen from "./LoginScreen";
import FinanceScreen from "./FinanceScreen";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

axios.defaults.baseURL =
  process.env.REACT_APP_BASE_URL || "http://localhost:1337";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (token) {
      axios.defaults.headers.common = { Authorization: `Bearer ${token}` };
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    axios.defaults.headers.common = {};
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/finance" />
                ) : (
                  <LoginScreen onLoginSuccess={handleLoginSuccess} />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? <FinanceScreen /> : <Navigate to="/" />
              }
            />
            <Route
              path="/finance"
              element={
                isAuthenticated ? <FinanceScreen onLogout={handleLogout} /> : <Navigate to="/" />
              }
            />
            <Route path="*" element={<Navigate to="/" />} />  
          </Routes>
        </header>
      </div>
    </BrowserRouter>
  );
}

export default App;
