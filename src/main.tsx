import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthRoute from "./components/AuthRoute";
import "./index.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <AuthRoute>
              <App />
            </AuthRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  </React.StrictMode>,
);
