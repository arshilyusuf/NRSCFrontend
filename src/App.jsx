import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import NotFound from "./pages/NotFound"; // You can create this for unmatched routes
import AdminPage from "./pages/AdminPage";
import Navbar from "./components/Navbar";
import Feedback from "./pages/Feedback";
import ProjectReportPage from "./pages/ProjectReportPage";
import Footer from "./components/Footer";
import styles from "./App.module.css";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminPageDuplicate from "./pages/AdminPageDuplicate";
import { AuthProvider } from "./context/AuthContext"; // import AuthProvider

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
            <Route path="login" element={<AdminLoginPage />} />
            <Route path="adminduplicate" element={<AdminPageDuplicate />} />
          </Routes>
          <Footer />
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
