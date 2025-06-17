import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./FeedbackSummary.module.css";
import axios from "axios";

const FeedbackSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData;
  const reportPdf = location.state?.reportPdf;
  const projectPpt = location.state?.projectPpt;
  const feedbackPdf = location.state?.feedbackPdf;

  const [submitting, setSubmitting] = React.useState(false);
  const [radioData, setRadioData] = React.useState(null);
  const [radioLoading, setRadioLoading] = React.useState(false);
  const [radioError, setRadioError] = React.useState(null);

  React.useEffect(() => {
    const fetchRadioData = async () => {
      if (!feedbackPdf) return;
      setRadioLoading(true);
      setRadioError(null);
      try {
        const data = new FormData();
        data.append("feedback_pdf", feedbackPdf);
        const res = await axios.post(
          "http://127.0.0.1:8000/api/feedbackprocess/",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setRadioData(res.data);
      } catch (err) {
        setRadioError("Failed to process feedback PDF.");
      } finally {
        setRadioLoading(false);
      }
    };
    fetchRadioData();
  }, [feedbackPdf]);

  if (!formData) {
    return <div>No feedback data found.</div>;
  }

  const handleGoBack = () => {
    navigate(-1, {
      state: {
        formData: formData,
        reportPdf: reportPdf,
        projectPpt: projectPpt,
        feedbackPdf: feedbackPdf,
      },
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const data = new FormData();

    Object.entries(formData).forEach(([key, val]) => {
      if (
        (key === "guidance" ||
          key === "system_time_availability" ||
          key === "computer_network_speed" ||
          key === "support_from_outreach_team" ||
          key === "food" ||
          key === "overall_arrangements") &&
        val === ""
      ) {
        data.append(key, "very_good");
      } else {
        data.append(key, val);
      }
    });

    // Append files
    data.append("project_report_pdf", reportPdf);
    if (projectPpt) data.append("project_ppt", projectPpt);
    if (feedbackPdf) data.append("feedback_pdf", feedbackPdf);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/feedback/submit/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("res:: ", res);
      alert(res.data.message || "Feedback submitted successfully!");
      localStorage.removeItem("feedbackFormData"); 
      navigate("/"); 
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to submit feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  function toTitleCase(str) {
    if (!str) return "";
    return str
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  }

  return (
    <div className={styles["feedback-summary-container"]}>
      <h2>Summary</h2>
      <div className={styles["summary-section"]}>
        <div className={styles["summary-details"]}>
          <h2>Details:</h2>
          <p>
            <strong>Name:</strong> {formData.name}
          </p>
          <p>
            <strong>College:</strong> {formData.college}
          </p>
          <p>
            <strong>Guide:</strong> {formData.guide}
          </p>
          <p>
            <strong>Project Title:</strong> {formData.project_title}
          </p>
          <p>
            <strong>Start Date:</strong> {formatDate(formData.start_date)}
          </p>
          <p>
            <strong>End Date:</strong> {formatDate(formData.end_date)}
          </p>
          <p>
            <strong>Division:</strong> {formData.division}
          </p>
          <p>
            <strong>Email:</strong> {formData.email}
          </p>
          <p>
            <strong>Remarks:</strong>
            <div
              style={{
                width: "100%",
                wordBreak: "break-word",
                display: "inline-block",
              }}
            >
              {formData.remarks}
            </div>
          </p>
        </div>

        {feedbackPdf ? (
          <div className={styles["summary-details"]}>
            <h2>Feedback:</h2>
            {radioLoading && <p>Processing feedback PDF...</p>}
            {radioError && <p style={{ color: "red" }}>{radioError}</p>}
            {radioData && (
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {Object.entries(radioData).map(([key, value]) => (
                  <li key={key}>
                    <strong>{toTitleCase(key)}:</strong> {toTitleCase(value)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div className={styles["summary-details"]}>
            <h2>Feedback:</h2>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {Object.entries(formData).map(([key, value]) => {
                if (
                  key === "guidance" ||
                  key === "system_time_availability" ||
                  key === "computer_network_speed" ||
                  key === "support_from_outreach_team" ||
                  key === "food" ||
                  key === "overall_arrangements"
                ) {
                  return (
                    <li key={key}>
                      <strong>{toTitleCase(key)}:</strong>{" "}
                      {toTitleCase(value) || "Very Good"}
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </div>
        )}
      </div>
      <div className={styles["summary-column"]}>
        <div className={styles["summary-buttons"]}>
          <button className={styles["go-back-btn"]} onClick={handleGoBack}>
            Go Back
          </button>
          <button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
        {submitting && (
          <p style={{ color: "gray" }}>
            Please don't exit the window while your response is being processed.
          </p>
        )}
      </div>
    </div>
  );
};

export default FeedbackSummary;
