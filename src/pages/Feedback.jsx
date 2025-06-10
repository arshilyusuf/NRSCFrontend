import React, { useState } from "react";
import styles from "./Feedback.module.css";
import axios from "axios";

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

  // Handle text inputs and radio button changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file inputs
  const handleReportPdfChange = (e) => setReportPdf(e.target.files[0]);
  const handleProjectPptChange = (e) => setProjectPpt(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reportPdf) {
      alert("Please upload the project report PDF file (mandatory).");
      return;
    }

    const data = new FormData();

    // Append text inputs
    Object.entries(formData).forEach(([key, val]) => {
      data.append(key, val);
    });

    // Append files
    data.append("project_report_pdf", reportPdf);
    if (projectPpt) data.append("project_ppt", projectPpt);

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
      });
      setReportPdf(null);
      setProjectPpt(null);
      e.target.reset();
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to submit feedback.");
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

          {/* Row 3 */}
          <div style={{ gridColumn: "2 / span 2" }}>
            <label htmlFor="remarks">Remarks:</label>
            <textarea
              id="remarks"
              name="remarks"
              rows={3}
              value={formData.remarks}
              onChange={handleChange}
              style={{ resize: "vertical" }}
              maxLength={1000}
            />
            <div
              style={{ textAlign: "right", fontSize: "0.9rem", color: "#888" }}
            >
              {formData.remarks.length}/1000 (max)
            </div>
          </div>

          {/* File uploads - spans 3 columns */}
          <div
            className={styles["date-group"]}
            style={{ gridColumn: "1 / span 3" }}
          >
            <label htmlFor="project_report_pdf" style={{ fontSize: "1.2rem" }}>
              Upload Project Report PDF (Required):
            </label>
            <input
              type="file"
              id="project_report_pdf"
              accept="application/pdf"
              onChange={handleReportPdfChange}
              required
            />
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
          </div>
        </div>

        {/* Feedback radio groups */}
        <div className={styles["feedback-options"]}>
          {feedbackOptions.map(({ label, name }) => (
            <div key={name} className={styles["feedback-option-group"]}>
              <label>{label}:</label>
              <div className={styles["radio-buttons"]}>
                {radioValues.map((opt) => (
                  <label key={opt}>
                    <input
                      type="radio"
                      name={name}
                      value={opt.toLowerCase().replace(/ /g, "_")}
                      onChange={handleChange}
                      required
                      checked={
                        formData[name] === opt.toLowerCase().replace(/ /g, "_")
                      }
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles["submit-button"]}>
          <button type="submit">Submit Feedback</button>
        </div>
      </form>
    </div>
  );
}
