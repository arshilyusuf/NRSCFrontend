import { useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const options = [
    { value: "overview", label: "Overview" },
    { value: "admin", label: "Admin" },
    { value: "feedback", label: "Submit Report" },
  ];

  const navigate = useNavigate();

  const handleSelect = (option) => {
    console.log("Selected:", option);
    // Redirect based on option value
    if (option.value === "admin") {
      navigate("/login");  // assuming /login is route for your AdminLoginPage
    } else if (option.value === "overview") {
      navigate("/"); // homepage or overview page route
    } else if (option.value === "feedback") {
      navigate("/feedback"); // your feedback page route
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.image} onClick={() => navigate("/")}>
        <img src="public/nrsclogo.png" alt="" />
      </div>
      <h2 className={styles.subtitle}>Project Display</h2>
      <Dropdown options={options} label="Overview" onSelect={handleSelect} />
    </nav>
  );
}
