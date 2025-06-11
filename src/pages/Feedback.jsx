import React, { useState } from "react";
import styles from "./Feedback.module.css";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Feedback() {
  const [formData, setFormData] = useState({
    name: "",
    college: "",
    guide: "",
    start_date: "",
    end_date: "",
    division: "",
    email: "",
    remarks: "",
    project_title: "",
    guidance: "",
    system_time_availability: "",
    computer_network_speed: "",
    support_from_outreach_team: "",
    food: "",
    overall_arrangements: "",
  });

  const [reportPdf, setReportPdf] = useState(null);
  const [projectPpt, setProjectPpt] = useState(null);
  const [feedbackPdf, setFeedbackPdf] = useState(null)
  const [submitting, setSubmitting] = useState(false);
  const [feedbackPdf, setFeedbackPdf] = useState(null);
  const { isAuthenticated } = useAuth();
  // Handle text inputs and radio button changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (
      [
        "guidance",
        "system_time_availability",
        "computer_network_speed",
        "support_from_outreach_team",
        "food",
        "overall_arrangements",
      ].includes(name)
    ) {
      setFeedbackPdf(null);
    }
  };

  const handleFeedbackPdfChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      alert("Feedback PDF must be less than 2 MB.");
      e.target.value = "";
      setFeedbackPdf(null);
      return;
    }
    setFeedbackPdf(file);
    // Clear radio button feedback if PDF is selected
    if (file) {
      // Clear all feedback radio values
      setFormData((prev) => ({
        ...prev,
        guidance: "",
        system_time_availability: "",
        computer_network_speed: "",
        support_from_outreach_team: "",
        food: "",
        overall_arrangements: "",
      }));
    }
  };

  // Disable feedback PDF if any radio is selected
  const isAnyRadioSelected = [
    formData.guidance,
    formData.system_time_availability,
    formData.computer_network_speed,
    formData.support_from_outreach_team,
    formData.food,
    formData.overall_arrangements,
  ].some((val) => val);

  // Handle file inputs with size limits
  const handleReportPdfChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 10 * 1024 * 1024) {
      // 10 MB
      alert("Project Report PDF must be less than 10 MB.");
      e.target.value = "";
      setReportPdf(null);
      return;
    }
    setReportPdf(file);
  };

  const handleProjectPptChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      // 5 MB
      alert("Project PPT must be less than 5 MB.");
      e.target.value = "";
      setProjectPpt(null);
      return;
    }
    setProjectPpt(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isAuthenticated) {
      if (!feedbackPdf && !isAnyRadioSelected) {
        alert(
          "Please either upload a Feedback PDF or fill the feedback options."
        );
        return;
      }
      if (feedbackPdf && isAnyRadioSelected) {
        alert(
          "Please use only one: either upload a Feedback PDF or fill the feedback options, not both."
        );
        return;
      }
    }

    if (!reportPdf) {
      alert("Please upload the project report PDF file (mandatory).");
      return;
    }

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
      // Reset form (optional)
      setFormData({
        name: "",
        college: "",
        guide: "",
        start_date: "",
        end_date: "",
        division: "",
        email: "",
        remarks: "",
        guidance: "",
        system_time_availability: "",
        computer_network_speed: "",
        support_from_outreach_team: "",
        food: "",
        overall_arrangements: "",
        project_title: "",
      });
      setReportPdf(null);
      setProjectPpt(null);
      e.target.reset();
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to submit feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  const feedbackOptions = [
    { label: "Guidance", name: "guidance" },
    { label: "System Time Availability", name: "system_time_availability" },
    { label: "Computer Network Speed", name: "computer_network_speed" },
    { label: "Support from Outreach Team", name: "support_from_outreach_team" },
    { label: "Food", name: "food" },
    { label: "Overall Arrangements", name: "overall_arrangements" },
  ];

  const radioValues = [
    "Excellent",
    "Very Good",
    "Good",
    "Satisfactory",
    "Poor",
  ];

  return (
    <div className={styles["feedback-container"]}>
      <h2>Feedback</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles["input-grid"]}>
          {/* Row 1 */}
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="college">College Name:</label>
            <input
              type="text"
              id="college"
              name="college"
              value={formData.college}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="guide">Guide Name:</label>
            <input
              type="text"
              id="guide"
              name="guide"
              value={formData.guide}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="project_title">Project Title:</label>
            <input
              type="text"
              id="project_title"
              name="project_title"
              value={formData.project_title}
              onChange={handleChange}
              required
            />
          </div>
          {/* Row 2 */}

          <div>
            <label htmlFor="division">Division:</label>
            <input
              type="text"
              id="division"
              name="division"
              value={formData.division}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles["date-group"]}>
            <label htmlFor="start_date">Start Date:</label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
            />
            <label htmlFor="end_date" style={{ marginTop: "0.5rem" }}>
              End Date:
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ gridColumn: "2 / span 2" }}>
            <label htmlFor="remarks">Remarks:</label>
            <textarea
              id="remarks"
              name="remarks"
              rows={3}
              value={formData.remarks}
              onChange={handleChange}
              style={{ height: "160px", resize: "none" }}
              maxLength={500}
            />
            <div
              style={{ textAlign: "right", fontSize: "0.9rem", color: "#888" }}
            >
              {formData.remarks.length}/500 (max)
            </div>
          </div>

          {/* File uploads - spans 3 columns */}
          <div
            className={styles["date-group"]}
            style={{ gridColumn: "1 / span 3" }}
          >
            <label htmlFor="project_report_pdf" style={{ fontSize: "1.2rem" }}>
              Upload Project Report PDF:
            </label>
            <input
              type="file"
              id="project_report_pdf"
              accept="application/pdf"
              onChange={handleReportPdfChange}
              required
            />
            <div
              style={{ color: "#888", fontSize: "0.95em", marginTop: "0.3em" }}
            >
              Max file size: 10 MB. Only PDF files allowed.
            </div>
          </div>
          <div
            className={styles["date-group"]}
            style={{ gridColumn: "1 / span 3" }}
          >
            <label htmlFor="project_ppt" style={{ fontSize: "1.2rem" }}>
              Upload Project PPT (Optional):
            </label>
            <input
              type="file"
              id="project_ppt"
              accept=".ppt,.pptx,application/pdf"
              onChange={handleProjectPptChange}
            />
            <div
              style={{ color: "#888", fontSize: "0.95em", marginTop: "0.3em" }}
            >
              Max file size: 5 MB. Allowed: PPT, PPTX, or PDF.
            </div>
          </div>
          {isAuthenticated && (
            <div
              className={styles["date-group"]}
              style={{ gridColumn: "1 / span 3" }}
            >
              <label htmlFor="feedback-pdf" style={{ fontSize: "1.2rem" }}>
                Upload Feedback PDF (Optional):
              </label>
              <input
                type="file"
                id="feedback-pdf"
                accept="application/pdf"
                onChange={handleFeedbackPdfChange}
                disabled={isAnyRadioSelected}
              />
              <div
                style={{
                  color: "#888",
                  fontSize: "0.95em",
                  marginTop: "0.3em",
                }}
              >
                Max file size: 2 MB. Only PDF files allowed.
                <br />
                <b>
                  If you upload a Feedback PDF, you cannot fill the feedback
                  options below.
                </b>
              </div>
            </div>
          )}
        </div>

        {/* Feedback radio groups */}
        <div className={styles["feedback-options"]}>
          {feedbackOptions.map(({ label, name }) => (
            <div key={name} className={styles["feedback-option-group"]}>
              <label className={styles["feedback-label"]}>{label}:</label>
              <div className={styles["radio-buttons"]}>
                {radioValues.map((opt) => {
                  const radioValue = opt.toLowerCase().replace(/ /g, "_");
                  return (
                    <label key={opt}>
                      <input
                        type="radio"
                        name={name}
                        value={radioValue}
                        onChange={handleChange}
                        required={!feedbackPdf && isAuthenticated}
                        checked={formData[name] === radioValue}
                        disabled={!!feedbackPdf}
                        onClick={() => {
                          if (formData[name] === radioValue) {
                            setFormData((prev) => ({ ...prev, [name]: "" }));
                          }
                        }}
                      />
                      {opt}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className={styles["submit-button"]}>
          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
          <button
            type="button"
            // style={{
              // marginLeft: "1rem",
              // background: "#e74c3c",
              // color: "#fff",
            // }}
            className={styles["clear-button"]}
            onClick={() => {
              setFormData({
                name: "",
                college: "",
                guide: "",
                start_date: "",
                end_date: "",
                division: "",
                email: "",
                remarks: "",
                guidance: "",
                system_time_availability: "",
                computer_network_speed: "",
                support_from_outreach_team: "",
                food: "",
                overall_arrangements: "",
                project_title: "",
              });
              setReportPdf(null);
              setProjectPpt(null);
              setFeedbackPdf(null);
              // Optionally clear file inputs if you want:
              document.getElementById("project_report_pdf").value = "";
              document.getElementById("project_ppt").value = "";
              const feedbackPdfInput = document.getElementById("feedback-pdf");
              if (feedbackPdfInput) feedbackPdfInput.value = "";
            }}
          >
            Clear Responses
          </button>
        </div>
      </form>
    </div>
  );
}
