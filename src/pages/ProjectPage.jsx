import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ProjectPage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

const ProjectPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    // Function to fetch project data based on projectId
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/projects/${projectId}/data/`); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch project');
        }
        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
        setProject(null);
      }
    };

    fetchProject();
  }, [projectId]);

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className={styles.projectContainer}>
      <h1 className={styles.projectTitle}>{project.project_title}</h1>
      <div className={styles.projectDetails}>
        <div className={styles.domainRow} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span className={styles.domain}>Domain:{" "}{project.domain}</span>
          {project.file_name && (
            <a
              href={`http://127.0.0.1:8000${project.file_name}`}
              target="_blank"
              rel="noopener noreferrer"
              title="View Project PDF"
              className={styles.viewReportButton}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5em", textDecoration: "none" }}
            >
              View Project Report
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </a>
          )}
        </div>
        <div className={styles.abstract}>
          <strong>Abstract: </strong> {project.abstract}
        </div> 
        <div className={styles.infoRow}>
          <strong>Students: </strong>
          {project.students && project.students.length > 0 ? (
            project.students.map((student, index) => (
              <span key={index}>
                {student} {project.colleges && project.colleges[index] ? `(${project.colleges[index]})` : ""}
                {index < project.students.length - 1 ? ", " : ""}
              </span>
            ))
          ) : (
            <span>No students</span>
          )}
        </div>
        <div className={styles.infoRow}>
          <strong>Guide: </strong> {project.guide_name}
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
