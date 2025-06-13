import { useEffect, useState } from "react";
import Display from "../components/Display";
import styles from "./Homepage.module.css";

export default function Homepage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    fetch("http://127.0.0.1:8000/projects/?format=json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch projects.");
        }
        return res.json();
      })
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

 

  return (
    <div
      className={styles.main}
      style={{
       
        overflowY: "auto",
        height: "100vh",
      }}
    >
      <div>
        {error ? (
          <div className={styles.errorBox}>
            <h2>🚫 Failed to Load Projects</h2>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className={styles.retryBtn}
            >
              Retry
            </button>
          </div>
        ) : loading ? (
          <p style={{
            textAlign: "center",
            fontSize: "1.2rem",
            color: "#666",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>Loading projects...</p>
        ) : (
          <Display projects={projects} />
        )}
      </div>
      
    </div>
  );
}
