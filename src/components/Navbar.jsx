import { useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown";
import styles from "./Navbar.module.css";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const options = [
    { value: "overview", label: "Overview" },
    { value: "admin", label: "Admin" },
    { value: "feedback", label: "Submit Report" },
  ];

  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [selectedDropdown, setSelectedDropdown] = useState(options[0]);

  const handleSelect = (option) => {
    setSelectedDropdown(option);
    // console.log("Selected:", option);
    // Redirect based on option value
    if (option.value === "admin") {
      navigate("/login"); // assuming /login is route for your AdminLoginPage
    } else if (option.value === "overview") {
      navigate("/"); // homepage or overview page route
    } else if (option.value === "feedback") {
      navigate("/feedback"); // your feedback page route
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
      <h2 className={styles.subtitle}>Project Report Hub</h2>
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
