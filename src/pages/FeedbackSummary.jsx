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

    // Append text inputs
    Object.entries(formData).forEach(([key, val]) => {
      data.append(key, val);
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
      alert(res.data.message || "Feedback submitted successfully!");
      localStorage.removeItem("feedbackFormData"); // Clear local storage
      navigate("/"); // Redirect to homepage or a success page
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to submit feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles["feedback-summary-container"]}>
      <h2>Feedback Summary</h2>
      <div className={styles["summary-details"]}>
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
          <strong>Start Date:</strong> {formData.start_date}
        </p>
        <p>
          <strong>End Date:</strong> {formData.end_date}
        </p>
        <p>
          <strong>Division:</strong> {formData.division}
        </p>
        <p>
          <strong>Email:</strong> {formData.email}
        </p>
        <p>
          <strong>Remarks:</strong> {formData.remarks}
        </p>
        <p>
          <strong>Guidance:</strong> {formData.guidance}
        </p>
        <p>
          <strong>System Time Availability:</strong>{" "}
          {formData.system_time_availability}
        </p>
        <p>
          <strong>Computer Network Speed:</strong> {formData.computer_network_speed}
        </p>
        <p>
          <strong>Support from Outreach Team:</strong>{" "}
          {formData.support_from_outreach_team}
        </p>
        <p>
          <strong>Food:</strong> {formData.food}
        </p>
        <p>
          <strong>Overall Arrangements:</strong> {formData.overall_arrangements}
        </p>
      </div>
      <div className={styles["summary-buttons"]}>
        <button onClick={handleGoBack}>Go Back</button>
        <button onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting..." : "Final Submit"}
        </button>
      </div>
    </div>
  );
};

export default FeedbackSummary;
