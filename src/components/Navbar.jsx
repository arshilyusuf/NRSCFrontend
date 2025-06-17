import { useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown";
import styles from "./Navbar.module.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

export default function Navbar() {
  const options = [
    { value: "overview", label: "Overview" },
    { value: "admin", label: "Admin" },
    { value: "feedback", label: "Submit Project/Internship Report" },
  ];

  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const location = useLocation();

  const [selectedDropdown, setSelectedDropdown] = useState(options[0]);
  useEffect(() => {
    if (location.pathname === "/") {
      setSelectedDropdown(options[0]); // Set to Overview if on homepage
    } else if (location.pathname === "/login") {
      setSelectedDropdown(options[1]); // Set to Admin if on login page
    } else if (location.pathname === "/feedback") {
      setSelectedDropdown(options[2]); // Set to Feedback if on feedback page
    }
  }, [location.pathname]);

  const handleSelect = (option) => {
    setSelectedDropdown(option);
    // console.log("Selected:", option);
    // Redirect based on option value
    if (option.value === "admin") {
      navigate("/login");
    } else if (option.value === "overview") {
      navigate("/");
    } else if (option.value === "feedback") {
      navigate("/feedback");
    }
  };

  return (
    <nav className={styles.navbar}>
      <div
        className={styles.image}
        onClick={() => {
          navigate("/");
          setSelectedDropdown(options[0]);
        }}
      >
        <img src="/nrsclogo.png" alt="" />
      </div>
      <h2 className={styles.subtitle}>Project Report Portal</h2>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Dropdown
          options={options}
          label="Overview"
          onSelect={handleSelect}
          selected={selectedDropdown}
          setSelected={setSelectedDropdown}
        />
        {isAuthenticated && (
          <>
            <button
              className={styles.remove}
              style={{ marginLeft: 0 }}
              onClick={() => setShowLogoutConfirm(true)}
            >
              Log Out
            </button>
            {showLogoutConfirm && (
              <div className={styles.logoutPopupOverlay}>
                <div className={styles.logoutPopup}>
                  <p>Are you sure you want to log out?</p>
                  <div className={styles.logoutPopupButtons}>
                    <button
                      className={styles.confirmButton}
                      onClick={() => {
                        logout();
                        navigate("/login");
                      }}
                    >
                      Yes
                    </button>
                    <button
                      className={styles.cancelButton}
                      onClick={() => setShowLogoutConfirm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
