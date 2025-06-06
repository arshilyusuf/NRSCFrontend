import { useState } from "react";
import styles from "./ProjectList.module.css";
import AbstractPreview from "./AbstractPreview";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom'; // Import Link

const ITEMS_PER_PAGE = 10;

const ProjectList = ({ projects }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);

  const paginatedProjects = projects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className={styles.container}>
      <h2>Projects</h2>
      <ul className={styles.list}>
        {paginatedProjects.map(
          (
            {
              students = [],
              colleges = [],
              project_title,
              domain,
              abstract,
              guide_name,
              file_name,
            },
            idx
          ) => (
            <li key={idx} className={styles.listItem}>
              
                  <h3 className={styles.projectName}>{project_title}</h3>
                
              <div style={{padding: "1rem 2rem"}}>
                <div className={styles.domainRow} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span className={styles.domain}>{domain}</span>
                  {file_name && (
                    <a
                      href={`http://127.0.0.1:8000/pdfs/${file_name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View Project PDF"
                      className={styles.add}
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.5em", textDecoration: "none" }}
                    >
                      View Project Report
                      <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                    </a>
                  )}
                </div>
                <AbstractPreview abstract={abstract} />
                <div className={styles.infoRow}>
                  <span className={styles.topic}>
                    By: &nbsp;
                    {students.length > 0
                      ? students.map((student, i) => (
                          <span key={i}>
                            {student}
                            {colleges[i] ? ` (${colleges[i]})` : ""}
                            {i < students.length - 1 ? ", " : ""}
                          </span>
                        ))
                      : "No students"}
                  </span>
                  {/* Removed domain from rightSide */}
                  <div className={styles.rightSide}></div>
                </div>
                {/* Guide name below students/colleges */}
                <div className={styles.infoRow}>
                  <span className={styles.guide}>
                    Guide: {guide_name ? guide_name : "N/A"}
                  </span>
                </div>
              </div>
            </li>
          )
        )}
      </ul>

      {/* Pagination Buttons */}
      <div className={styles.pagination}>
        <button onClick={goToPrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ProjectList;
