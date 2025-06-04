import React, { useState } from "react";
import styles from './ProjectList.module.css'
const AbstractPreview = ({ abstract }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!abstract) {
    return <span className={styles.abstract}>No abstract available</span>;
  }
  // Split the original abstract (not lowercased) for preview
  const words = abstract.split(" ");
  const shouldTruncate = words.length > 40;
  const previewText = words.slice(0, 40).join(" ");
  const fullText = abstract;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <span className={styles.abstract}>
      {isExpanded || !shouldTruncate ? fullText : `${previewText}...`}
      {shouldTruncate && (
        <button
          onClick={toggleExpanded}
          className={styles.toggleButton}
          type="button"
        >
          {isExpanded ? " Show less" : " Show more"}
        </button>
      )}
    </span>
  );
};

export default AbstractPreview;
