import { useState } from "react";
import { useNavigate } from "react-router-dom"; // import useNavigate
import styles from "./Dropdown.module.css";

export default function Dropdown({
  options,
  label = "Select",
  onSelect,
  selected,
  setSelected,
}) {
  const [isOpen, setIsOpen] = useState(false);
  // const [selected, setSelected] = useState(null);
  // const navigate = useNavigate(); // initialize navigate

  const handleSelect = (option) => {
    setSelected(option);
    onSelect?.(option);
    setIsOpen(false);
  };
  //   // Navigate to /admin if option.value is "admin"
  //   if (option.value === "admin") {
  //     navigate("/admin");
  //   } else if (option.value === "overview") {
  //     navigate("/");
  //   } else if (option.value === "feedback") {
  //     navigate("/feedback");
  //   }
  // };

  return (
    <div className={styles.dropdown}>
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={styles.button}
        >
          {selected ? selected.label : label}
          <svg className={styles.icon} viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className={styles.menu}>
          <div>
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option)}
                className={styles.menuItem}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
