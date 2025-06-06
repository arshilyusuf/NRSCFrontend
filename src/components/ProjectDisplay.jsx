import styles from "./ProjectDisplay.module.css";
import { useNavigate } from "react-router-dom";
export default function ProjectDisplay({ project }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/project/${project.project_id}/`);
  }
  return (
    <div className={styles.card} onClick={handleClick}>
      <h1 className={styles.title}>{project.project_title}</h1>
      <h3 className={styles.cat}>{project.domain}</h3>

      <p className={styles.description}>{project.abstract}</p>
      <p className={styles.meta}>
        <strong>
          By:{" "}
          {project.students && project.students.length > 0
            ? project.students.join(", ")
            : "N/A"}
        </strong>
            <br />
        <strong>
          College:{" "}
          {project.colleges && project.colleges.length > 0
            ? project.colleges.join(", ")
            : "N/A"}
        </strong>
<br />
        <strong>Guide: {project.guide_name}</strong>
      </p>
    </div>
  );
}
