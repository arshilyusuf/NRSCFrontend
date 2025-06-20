import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Dropdown.module.css";

export default function Dropdown({ options }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [active, setActive] = useState(
    options.find((opt) => opt.value === location.pathname)?.value || options[0].value
  );

useEffect(() => {
  const matchedOption = options.find(opt =>
    opt.paths.some(path => 
      location.pathname === path || location.pathname.startsWith(path + "/")
    )
  );
  setActive(matchedOption ? matchedOption.value : null);
}, [location.pathname, options]);



  const handleClick = (option) => {
    setActive(option.value);
    navigate(option.value);
  };

  return (
    <div className={styles.navbar}>
      {options.map((option) => (
        <div
          key={option.value}
          className={`${styles.navItem} ${active === option.value ? styles.active : ""}`}
        >
          <button
            className={styles.navButton}
            onClick={() => handleClick(option)}
          >
            {option.label}
            <div className={`${option.label === "Admin" ? styles.adminTool : styles.tooltip}`}>{option.description}</div>
          </button>
        </div>
      ))}
    </div>
  );
}


  // return (
    // <div className={styles.dropdown} ref={dropdownRef}>
    //   <div>
    //     <button
    //       type="button"
    //       onClick={() => setIsOpen(!isOpen)}
    //       className={styles.button}
    //     >
    //       {selected ? selected.label : label}
    //       <svg className={styles.icon} viewBox="0 0 20 20" fill="currentColor">
    //         <path
    //           fillRule="evenodd"
    //           d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
    //           clipRule="evenodd"
    //         />
    //       </svg>
    //     </button>
    //   </div>

    //   {isOpen && (
    //     <div className={styles.menu}>
    //       <div>
    //         {options.map((option) => (
    //           <button
    //             key={option.value}
    //             onClick={() => handleSelect(option)}
    //             className={styles.menuItem}
    //           >
    //             {option.label}
    //           </button>
    //         ))}
    //       </div>
    //     </div>
    //   )}
    // </div>
//      <div className={styles.dropdown} ref={dropdownRef}>
      
//     </div>
//   );
// }
