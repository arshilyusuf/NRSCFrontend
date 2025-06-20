import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import Feedback from "./pages/Feedback";
import Homepage from "./pages/Homepage";
import Login from "./pages/AdminLoginPage";
import Navbar from "./components/Navbar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProjectPage from "./pages/ProjectPage";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";
import styles from "./App.module.css";
import FeedbackSummary from "./pages/FeedbackSummary";
import TokenWatcher from "./utils/TokenWatcher"; 
function AppContent() {
  return (
    <div className={styles.main}>
      <TokenWatcher /> 
      <Router>
        <Navbar />
        <div style={{ marginTop: "10vh" }}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="*" element={<NotFound />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="login" element={<Login />} />
            <Route path="/project/:projectId" element={<ProjectPage />} />
            <Route path="/feedback-summary" element={<FeedbackSummary />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
