import ProjectList from "../components/ProjectList";
import styles from "./AdminPage.module.css";
import React, { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const FEEDBACK_API_URL = "http://127.0.0.1:8000/api/feedback/data/";

const feedbackRatingMap = {
  excellent: 5,
  very_good: 4,
  good: 3,
  satisfactory: 2,
  poor: 1,
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`;
}

function mapRating(value) {
  if (!value) return "";
  return feedbackRatingMap[value.toLowerCase()] ?? value;
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { isAuthenticated, auth, logout } = useContext(AuthContext);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [activeTab, setActiveTab] = useState("projects");
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
  const [expandedRemarks, setExpandedRemarks] = useState({});
  const [feedbackSearch, setFeedbackSearch] = useState("");
  const [feedbackStartDate, setFeedbackStartDate] = useState("");
  const [feedbackEndDate, setFeedbackEndDate] = useState("");
  const [showStats, setShowStats] = useState(false);
  const [processing, setProcessing] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !auth?.token) {
      navigate("/login");
      return;
    }

    fetch("http://127.0.0.1:8000/projects", {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch projects.");
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
  }, [isAuthenticated, auth]);

  useEffect(() => {
    if (activeTab === "feedbacks" && feedbacks.length === 0) {
      setLoadingFeedbacks(true);
      fetch(FEEDBACK_API_URL)
        .then((res) => res.json())
        .then((data) => {
          setFeedbacks(data);
          setLoadingFeedbacks(false);
        })
        .catch(() => setLoadingFeedbacks(false));
    }
  }, [activeTab, feedbacks.length]);

  if (!isAuthenticated || !auth?.token) {
    return null
  }
  const handleProcessPdfMail = async () => {
    setProcessing(true);
    try {
      console.log("Processing PDFs from Gmail...");
      const res = await fetch("http://127.0.0.1:8000/fetch-gmail-pdfs-Admin/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      console.log("Response status:", res.status);
      if (res.ok) {
        const message = await res.text();
        alert(message || "PDFs processed successfully!");
      } else {
        const errorText = await res.text();
        alert(errorText || "Failed to process PDFs.");
      }
    } catch (err) {
      alert("ERROR: " + (err?.message || "An error occurred while processing PDFs."));
    } finally {
      setProcessing(false);
    }
  };
  const handleProcessPdfSystem = async () => {
    setProcessing(true);
    try {
      console.log("Processing PDFs from system...");
      const res = await fetch("http://127.0.0.1:8000/batch-process-pdfs/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      console.log("Response status:", res.status);
      if (res.ok) {
        const message = await res.text();
        alert(message || "PDFs processed successfully!");
      } else {
        const errorText = await res.text();
        alert(errorText || "Failed to process PDFs.");
      }
    } catch (err) {
      alert("ERROR: " + (err?.message || "An error occurred while processing PDFs."));
    } finally {
      setProcessing(false);
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        // Toggle direction
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      // Default to ascending
      return { key, direction: "asc" };
    });
  };

  const handleSearchChange = (e) => {
    const rawInput = e.target.value;
    setSearchTerm(rawInput);

    const keywords = rawInput.toLowerCase().trim().split(/\s+/).filter(Boolean);

    if (keywords.length === 0) {
      setFilteredResults([]);
    } else {
      const results = projects.filter((project) => {
        const fields = [project.project_title, project.domain, project.students, project.guide_name]
          .join(" ")
          .toLowerCase();
        return keywords.some((word) => fields.includes(word));
      });
      setFilteredResults(results);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredResults([]);
  };

  // Filter feedbacks by search and date range
  const filteredFeedbacks = feedbacks.filter((fb) => {
    // Date range filter
    const inDateRange =
      (!feedbackStartDate ||
        new Date(fb.start_date) >= new Date(feedbackStartDate)) &&
      (!feedbackEndDate || new Date(fb.end_date) <= new Date(feedbackEndDate));
    // Search filter
    const search = feedbackSearch.trim().toLowerCase();
    const matchesSearch =
      !search ||
      [fb.name, fb.college, fb.guide, fb.email, fb.project_title]
        .join(" ")
        .toLowerCase()
        .includes(search);
    return inDateRange && matchesSearch;
  });

  const sortedFeedbacks = React.useMemo(() => {
    if (!sortConfig.key) return filteredFeedbacks;
    return [...filteredFeedbacks].sort((a, b) => {
      const dateA = new Date(a[sortConfig.key]);
      const dateB = new Date(b[sortConfig.key]);
      if (dateA < dateB) return sortConfig.direction === "asc" ? -1 : 1;
      if (dateA > dateB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredFeedbacks, sortConfig]);

  // Helper to get stats for a field
  function getFieldStats(feedbacksArr, field) {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    // let total = 0;
    // let percent = 0;

    let sum = 0;
    let num = 0;
    feedbacksArr.forEach((fb) => {
      const val = mapRating(fb[field]);
      if ([1, 2, 3, 4, 5].includes(val)) {
        counts[val]++;
        sum += val;
        num++;
      }
    });
    return {
      counts,
      total: (counts[5] * 5 + counts[4] * 4.5 + counts[3] * 4 + counts[2] * 3 + counts[1] * 1).toFixed(1),
      percent: (((counts[5] * 5 + counts[4] * 4.5 + counts[3] * 4 + counts[2] * 3 + counts[1] * 1) * 100) / ((counts[5] + counts[4] + counts[3] + counts[2] + counts[1]) * 5)).toFixed(2),
      num,
    };
  }

  // List of radio fields to show stats for
  const radioFields = [
    { key: "guidance", label: "Guidance" },
    { key: "system_time_availability", label: "System Time" },
    { key: "computer_network_speed", label: "Network Speed" },
    { key: "support_from_outreach_team", label: "Outreach Support" },
    { key: "food", label: "Food" },
    { key: "overall_arrangements", label: "Arrangements" },
  ];

  return (
    <div className={styles.pageContainer}>
      {/* Tab Switcher */}
      <div className={styles.tabSwitcher}>
        <h1 className={styles.pageTitle}>Admin Dashboard</h1>

        <div className={styles.tabs}>
          <button
            className={`${styles.tabButton} ${activeTab === "projects" ? styles.activeTab : ""
              }`}
            onClick={() => setActiveTab("projects")}
          >
            Projects
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "feedbacks" ? styles.activeTab : ""
              }`}
            onClick={() => setActiveTab("feedbacks")}
          >
            Feedbacks
          </button>
        </div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.heading}>
          <div className={styles.options}>
            {activeTab === "projects" && (
              <>
                <div
                  className={styles.searchContainer}
                  ref={searchContainerRef}
                >
                  <input
                    type="text"
                    id="search"
                    className={styles.select}
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    autoComplete="off"
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
                  
                {!processing ? (
                  <>
                  <button
                    onClick={handleProcessPdfMail}
                    className={styles.processButton}
                  >
                    Process PDFs from mail
                  </button>
                  <button
                    onClick={handleProcessPdfSystem}
                    className={styles.processButton}
                  >
                    Process PDFs from system
                  </button>
                  </>
                ) : (
                  <button 
                    className={styles.processButton}
                    disabled={processing}
                  >
                    Processing...This might take a few minutes
                  </button>
                )}
              </>
            )}
          </div>
          
        </div>

        {activeTab === "projects" && (
          <>
        <div className={styles.helperText}>
          Search by project title, student name, or guide name.
        </div>
          <ProjectList projects={searchTerm ? filteredResults : projects} />
          </>
        )}

        {activeTab === "feedbacks" && (
          <div className={styles.feedbacksWrapper}>
            <h2 className={styles.pageTitle}>Feedbacks</h2>
            {/* Feedback Filters */}
            <div className={styles.feedbackFilters}>
              <input
                type="text"
                placeholder="Search feedbacks..."
                className={styles.feedbackSearchInput}
                value={feedbackSearch}
                onChange={(e) => setFeedbackSearch(e.target.value)}
                style={{ marginRight: "1rem" }}
              />
              <button
                className={styles.statsButton}
                onClick={() => setShowStats((prev) => !prev)}
              >
                {showStats ? "Hide Stats" : " Show Stats"}
              </button>
              <label>
                Start Date:{" "}
                <input
                  type="date"
                  value={feedbackStartDate}
                  onChange={(e) => setFeedbackStartDate(e.target.value)}
                  className={styles.dateInput}
                />
              </label>
              <label style={{ marginLeft: "1rem" }}>
                End Date:{" "}
                <input
                  type="date"
                  value={feedbackEndDate}
                  min={feedbackStartDate || ""}
                  onChange={(e) => setFeedbackEndDate(e.target.value)}
                  className={styles.dateInput}
                />
              </label>
              {(feedbackSearch || feedbackStartDate || feedbackEndDate) && (
                <button
                  type="button"
                  className={styles.clearButton}
                  style={{ marginLeft: "1rem" }}
                  onClick={() => {
                    setFeedbackSearch("");
                    setFeedbackStartDate("");
                    setFeedbackEndDate("");
                  }}
                  aria-label="Clear filters"
                >
                  &times;
                </button>
              )}
            </div>
            <div className={styles.helperTextF}>
          Search by project title, student name, or guide name.
        </div>
            <div style={{
              marginBottom: "1rem",
              fontWeight: "bold",
              marginLeft: "0.5rem"
            }}>
              Number of Feedbacks: {filteredFeedbacks.length}
            </div>
            {showStats && (
              <div className={styles.statsPanel}>
                <h3>
                  Stats for{" "}
                  {feedbackStartDate || feedbackEndDate
                    ? `${feedbackStartDate || "start"} to ${feedbackEndDate || "end"
                    }`
                    : "all feedbacks"}
                </h3>
                <div className={styles.statsTableWrapper}>
                  <table className={styles.statsTable}>
                    <thead>
                      <tr>
                        <th>Field</th>
                        <th>Excellent (5)</th>
                        <th>Very Good (4.5)</th>
                        <th>Good (4)</th>
                        <th>Satisfactory (3)</th>
                        <th>Poor (1)</th>
                        <th>Total Score</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {radioFields.map(({ key, label }) => {
                        const stats = getFieldStats(filteredFeedbacks, key);
                        return (
                          <tr key={key}>
                            <td>{label}</td>
                            <td>{stats.counts[5]}</td>
                            <td>{stats.counts[4]}</td>
                            <td>{stats.counts[3]}</td>
                            <td>{stats.counts[2]}</td>
                            <td>{stats.counts[1]}</td>
                            <td>{stats.total}</td>
                            <td>{stats.percent}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {loadingFeedbacks ? (
              <div>Loading feedbacks...</div>
            ) : (
              <div className={styles.feedbackList}>
                {filteredFeedbacks.length === 0 ? (
                  <div>No feedbacks found.</div>
                ) : (
                  <table className={styles.feedbackTable}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>College</th>
                        <th>Guide</th>
                        <th>Project Title</th>
                        <th style={{ cursor: "pointer" }} onClick={() => handleSort("start_date")}>
                          Start Date{" "}
                          {sortConfig.key === "start_date" ? (
                            sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />
                          ) : (
                            <FaSort />
                          )}
                        </th>
                        <th style={{ cursor: "pointer" }} onClick={() => handleSort("end_date")}>
                          End Date{" "}
                          {sortConfig.key === "end_date" ? (
                            sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />
                          ) : (
                            <FaSort />
                          )}
                        </th>
                        <th>Division</th>
                        <th>Email</th>
                        <th>Guidance</th>
                        <th>System Time</th>
                        <th>Network Speed</th>
                        <th>Outreach Support</th>
                        <th>Food</th>
                        <th>Arrangements</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedFeedbacks.map((fb, idx) => (
                        <tr key={idx}>
                          <td>{fb.name}</td>
                          <td>{fb.college}</td>
                          <td>{fb.guide}</td>
                          <td>{fb.project_title}</td>
                          <td>{formatDate(fb.start_date)}</td>
                          <td>{formatDate(fb.end_date)}</td>
                          <td>{fb.division}</td>
                          <td>{fb.email}</td>
                          <td>{mapRating(fb.guidance)}</td>
                          <td>{mapRating(fb.system_time_availability)}</td>
                          <td>{mapRating(fb.computer_network_speed)}</td>
                          <td>{mapRating(fb.support_from_outreach_team)}</td>
                          <td>{mapRating(fb.food)}</td>
                          <td>{mapRating(fb.overall_arrangements)}</td>
                          <td
                            style={{
                              width: "300px",
                              wordBreak: "break-word",
                              display: "inline-block",
                              height: "100%",
                            }}
                          >
                            {fb.remarks && fb.remarks.length > 50 ? (
                              <>
                                {expandedRemarks[idx]
                                  ? fb.remarks
                                  : fb.remarks.slice(0, 50) + "..."}
                                <button
                                  style={{
                                    marginLeft: "0.5rem",
                                    background: "none",
                                    border: "none",
                                    color: "#0a3d62",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                    fontSize: "0.95em",
                                    padding: 0,
                                  }}
                                  onClick={() =>
                                    setExpandedRemarks((prev) => ({
                                      ...prev,
                                      [idx]: !prev[idx],
                                    }))
                                  }
                                >
                                  {expandedRemarks[idx]
                                    ? "View less"
                                    : "View more"}
                                </button>
                              </>
                            ) : (
                              <p style={{ height: "100%" }}>{fb.remarks}</p>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

}
