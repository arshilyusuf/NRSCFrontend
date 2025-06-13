import { useEffect, useState } from "react";
import ProjectDisplay from "./ProjectDisplay";
import styles from "./Display.module.css";
import LeftPanel from "./LeftPanel";
import { FaArrowLeft, FaArrowRight, FaBars } from "react-icons/fa";
import ProjectList from "./ProjectList";

export default function Display({ projects }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [domainType, setDomainType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayedProjects, setDisplayedProjects] = useState(projects);
  const [batchIndex, setBatchIndex] = useState(0);
  const batchSize = 10;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = Math.min(batchSize, displayedProjects.length) - 1;
        return prevIndex === maxIndex ? 0 : prevIndex + 1;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [displayedProjects.length, batchIndex]);

  useEffect(() => {
    if (domainType) {
      const filtered = projects.filter((project) => {
        return project.domain === domainType;
      });
      setDisplayedProjects(filtered);
    } else {
      setDisplayedProjects(projects);
    }
    setCurrentIndex(0);
    setBatchIndex(0);
  }, [domainType, projects]);

  const goToIndex = (index) => {
    setCurrentIndex(index);
  };

  const togglePanel = () => {
    setIsPanelVisible((prev) => !prev);
  };

  const maxBatch = Math.floor((displayedProjects.length - 1) / batchSize);

  const currentBatchProjects = displayedProjects.slice(
    batchIndex * batchSize,
    batchIndex * batchSize + batchSize
  );

  const handleNextBatch = () => {
    if (batchIndex < maxBatch) {
      setBatchIndex(batchIndex + 1);
      setCurrentIndex(0);
    }
  };

  const handlePrevBatch = () => {
    if (batchIndex > 0) {
      setBatchIndex(batchIndex - 1);
      setCurrentIndex(0);
    }
  };

  return (
    <>
    <div className={styles.main}>
      <div
        className={`${styles.leftPanel} ${
          isPanelVisible ? styles.slideIn : styles.slideOut
        }`}
      >
        <LeftPanel
          domainType={domainType}
          setDomainType={setDomainType}
          loading={loading}
          setLoading={setLoading}
          error={error}
          setError={setError}
          projects={projects}
        />
      </div>

      <button className={styles.toggleButton} onClick={togglePanel}>
        <FaBars />
      </button>

      <div className={styles.wrapper}>
        <div
          className={styles.slider}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {displayedProjects.length === 0 && (
            <div className={styles.errorBox}>
              <h2>No Projects</h2>
            </div>
          )}
          {currentBatchProjects.map((project, index) => (
            <div className={styles.projectItem} key={index}>
              <ProjectDisplay project={project} />
            </div>
          ))}
        </div>

        <div className={styles.dots}>
          {displayedProjects.length !== 0 && (
            <div className={styles.dotsbatch}>
              {batchIndex > 0 && (
                <button
                  onClick={handlePrevBatch}
                  style={{ marginRight: "2rem" }}
                >
                  ← {batchIndex}
                </button>
              )}

              {currentBatchProjects.map((_, index) => (
                <div
                  key={index}
                  className={`${styles.dot} ${
                    index === currentIndex ? styles.activeDot : ""
                  }`}
                  onClick={() => goToIndex(index)}
                />
              ))}

              {batchIndex < maxBatch && (
                <button
                  onClick={handleNextBatch}
                  style={{ marginLeft: "2rem" }}
                >
                  {batchIndex + 2} →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
      <div className={styles.projectListContainer}>
        <ProjectList projects={displayedProjects} />
      </div>
    </>
  );
}
