import { useState, useEffect, useRef } from "react";
import styles from "./LeftPanel.module.css";

export default function LeftPanel({ projects, domainType, setDomainType }) {
  const domain = [
    "Research based or innovation",
    "Technology Demonstration",
    "Software Development",
    "Hardware Development",
    "Cyber security",
    "AI",
    "ML",
    "DEEP LEARNING",
    "IOT",
    "Neural Netwrok",
    "Block Chain",
    "Agriculture",
    "Disaster Management Support",
    "Forestry & Ecology",
    "Geosciences",
    "LULC",
    "Rural Development",
    "Soils",
    "Urban & Infrastructure",
    "Water Resources",
    "Earth and Climatic Studies",
  ];

  // const technical_domains = [
  //   "Remote Sensing and GIS",
  //   "App Development",
  //   "Web Development",
  //   "AI/ML",
  //   "Image Processing/Computer Vision",
  //   "Data Science / Big Data Analytics",
  //   "Cloud Computing / High Performance Computing",
  //   "IoT",
  //   "Sensor Integration",
  //   "Drone Data Processing and Integration",
  //   "AR/VR",
  //   "Robotics",
  //   "Embedded Systems",
  //   "3D Printing / Fabrication Technology",
  // ];

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [domainList, setDomainList] = useState([]);
  const searchContainerRef = useRef(null);

  const handleDomainTypeChange = (e) => {
    const type = e.target.value;
    setDomainType(type);
    setDomainList(domain);
  };

  const handleSearchChange = (e) => {
    const rawInput = e.target.value;
    setSearchTerm(rawInput);

    const keywords = rawInput
      .toLowerCase()
      .trim()
      .split(/\s+/) // splits on one or more spaces
      .filter(Boolean); // removes empty strings

    if (keywords.length === 0) {
      setFilteredResults([]);
    } else {
      const results = projects.filter((project) => {
        const fields = [project.project_title, project.domain]
          .join(" ")
          .toLowerCase();

        return keywords.some((word) => fields.includes(word));
      });
      setFilteredResults(results);
    }
  };

  // Clear search handler
  const clearSearch = () => {
    setSearchTerm("");
    setFilteredResults([]);
  };

  // Close dropdown when clicking outside search area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setFilteredResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Filter Projects</h2>

      <label htmlFor="search" className={styles.label}>
        Search
      </label>
      <div className={styles.searchContainer} ref={searchContainerRef}>
        <input
          type="text"
          id="search"
          className={styles.select}
          placeholder="Search projects..."
          value={searchTerm}
          onChange={handleSearchChange}
          autoComplete="on"
        />
        {searchTerm && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={clearSearch}
            aria-label="Clear search"
          >
            &times;
          </button>
        )}
      </div>

      {searchTerm && filteredResults.length > 0 && (
        <ul className={styles.dropdown}>
          {filteredResults.map((project) => (
            <li key={project.id} className={styles.dropdownItem}>
              {project.project_title}
            </li>
          ))}
        </ul>
      )}

      <div className={styles.group}>
        <label htmlFor="domainType" className={styles.label}>
          Domain Type
        </label>
        <select
          id="domainType"
          value={domainType}
          onChange={handleDomainTypeChange}
          className={styles.select}
        >
          <option value="">Select Domain</option>
          {domain.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
