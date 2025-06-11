import ProjectList from "../components/ProjectList";
import styles from "./AdminPage.module.css";
import FilterPanel from "../components/FilterPanel";
import { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaPlus } from "react-icons/fa";

const FEEDBACK_API_URL = "http://127.0.0.1:8000/api/feedback/data/";

const feedbackRatingMap = {
  excellent: 5,
  very_good: 4,
  good: 3,
  average: 2,
  poor: 1,
};

function mapRating(value) {
  if (!value) return "";
  return feedbackRatingMap[value.toLowerCase()] ?? value;
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { isAuthenticated, auth, logout } = useContext(AuthContext);

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

  if (!isAuthenticated) return null;

  const handleSearchChange = (e) => {
    const rawInput = e.target.value;
    setSearchTerm(rawInput);

    const keywords = rawInput.toLowerCase().trim().split(/\s+/).filter(Boolean);

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

  // Helper to get stats for a field
  function getFieldStats(feedbacksArr, field) {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
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
      avg: num ? (sum / num).toFixed(2) : "-",
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
            className={`${styles.tabButton} ${
              activeTab === "projects" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("projects")}
          >
            Projects
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === "feedbacks" ? styles.activeTab : ""
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
                    autoComplete="on"
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
                <button
                  className={styles.add}
                  onClick={() => navigate("/projectreport")}
                >
                  Add Project <FaPlus/>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "projects" && (
          <ProjectList projects={searchTerm ? filteredResults : projects} />
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
                {showStats ? "Hide Stats" : "Stats"}
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

            {showStats && (
              <div className={styles.statsPanel}>
                <h3>
                  Stats for{" "}
                  {feedbackStartDate || feedbackEndDate
                    ? `${feedbackStartDate || "start"} to ${
                        feedbackEndDate || "end"
                      }`
                    : "all feedbacks"}
                </h3>
                <div className={styles.statsTableWrapper}>
                  <table className={styles.statsTable}>
                    <thead>
                      <tr>
                        <th>Field</th>
                        <th>Excellent (5)</th>
                        <th>Very Good (4)</th>
                        <th>Good (3)</th>
                        <th>Average (2)</th>
                        <th>Poor (1)</th>
                        <th>Average</th>
                        <th>Count</th>
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
                            <td>{stats.avg}</td>
                            <td>{stats.num}</td>
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
                        <th>Start Date</th>
                        <th>End Date</th>
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
                      {filteredFeedbacks.map((fb, idx) => (
                        <tr key={idx}>
                          <td>{fb.name}</td>
                          <td>{fb.college}</td>
                          <td>{fb.guide}</td>
                          <td>{fb.project_title}</td>
                          <td>{fb.start_date}</td>
                          <td>{fb.end_date}</td>
                          <td>{fb.division}</td>
                          <td>{fb.email}</td>
                          <td>{mapRating(fb.guidance)}</td>
                          <td>{mapRating(fb.system_time_availability)}</td>
                          <td>{mapRating(fb.computer_network_speed)}</td>
                          <td>{mapRating(fb.support_from_outreach_team)}</td>
                          <td>{mapRating(fb.food)}</td>
                          <td>{mapRating(fb.overall_arrangements)}</td>
                          <td>
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
                              fb.remarks
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
