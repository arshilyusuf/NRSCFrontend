import { useState, useEffect, useRef } from "react";
import styles from "./LeftPanel.module.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function LeftPanel({ projects, domainType, setDomainType }) {
  const domain = [
    "Research-based or Innovation",
    "Technology Demonstration",
    "Software Development",
    "Hardware Development",
    "Cyber security",
    "AI",
    "ML",
    "Deep Learning",
    "IoT",
    "Neural Network",
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
  const navigate = useNavigate(); // Initialize useNavigate
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

  const handleProjectSelect = (project) => {
    navigate(`/project/${project.project_id}`);
  };

  // Clear search handler
  const clearSearch = () => {
    setSearchTerm("");
    setFilteredResults([]);
  };

  // Close dropdown when clicking outside search area


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
        <div className={styles.helperText}>
          Search by project title, student's name, or guide's name.
        </div>
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
            <li
              key={project.id}
              className={styles.dropdownItem}
              onClick={() => handleProjectSelect(project)}
            >
              {project.project_title}
            </li>
          ))}
        </ul>
      )}

      <div className={styles.group}>
        <label htmlFor="domainType" className={styles.label} style={{marginTop: "1rem"}}>
          Domain Type
        </label>
        <select
          id="domainType"
          value={domainType}
          onChange={handleDomainTypeChange}
          className={styles.select}
        >
          <option value="">All</option>
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
