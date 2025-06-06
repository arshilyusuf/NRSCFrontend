import React, { useState, useRef, useLayoutEffect } from "react";
import styles from './ProjectList.module.css'
const AbstractPreview = ({ abstract }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);
  // Split the original abstract (not lowercased) for preview
  const words = abstract.split(" ");
  const shouldTruncate = words.length > 40;
  const previewText = words.slice(0, 40).join(" ");
  const fullText = abstract;
  
  // For smooth transition, set maxHeight dynamically
  const [maxHeight, setMaxHeight] = useState("0px");
  useLayoutEffect(() => {
    if (contentRef.current) {
      setMaxHeight(isExpanded ? `${contentRef.current.scrollHeight}px` : "2.5em");
    }
  }, [isExpanded, abstract]);
  if (!abstract) {
    return <span className={styles.abstract}>No abstract available</span>;
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <span className={styles.abstract}>
      <span
        ref={contentRef}
        className={`${styles.abstractContent} ${isExpanded ? styles.expanded : ""}`}
        style={{
          maxHeight: isExpanded ? maxHeight : "2.5em",
          opacity: isExpanded ? 1 : 0.85,
          transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s",
          display: "block",
          overflow: "hidden",
          whiteSpace: "pre-line"
        }}
      >
        {isExpanded || !shouldTruncate ? fullText : `${previewText}...`}
      </span>
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
