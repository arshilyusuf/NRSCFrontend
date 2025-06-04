import styles from "./ProjectDisplay.module.css";
export default function ProjectDisplay({ project }) {
  return (
    <div className={styles.card}>
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

        <strong>
          College:{" "}
          {project.colleges && project.colleges.length > 0
            ? project.colleges.join(", ")
            : "N/A"}
        </strong>

        <strong>Guide: {project.guide_name}</strong>
      </p>
    </div>
  );
}
