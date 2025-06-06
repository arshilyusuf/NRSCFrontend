import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import Feedback from "./pages/Feedback";
import Homepage from "./pages/Homepage";
import Login from "./pages/AdminLoginPage";
import ProjectReportPage from "./pages/ProjectReportPage";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import ProjectPage from "./pages/ProjectPage"; // Import the new component
import NotFound from "./pages/NotFound"; // You can create this for unmatched routes
import Footer from "./components/Footer";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.main}>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="*" element={<NotFound />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="projectreport" element={<ProjectReportPage />} />
            <Route path="login" element={<Login />} />
            <Route path="/project/:projectId" element={<ProjectPage />} />
          </Routes>
          <Footer />
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
