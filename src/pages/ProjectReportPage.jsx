// import React, { useState, useContext } from "react";
// import styles from "./ProjectReport.module.css";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext"; // ✅ import context
// import { useNavigate } from "react-router-dom";

// const ProjectReportPage = () => {
//   const [pdfFile, setPdfFile] = useState(null);
//   const { auth, isAuthenticated } = useContext(AuthContext); // ✅ use token
//   const navigate = useNavigate();

//   const handleFileChange = (e) => {
//     setPdfFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!isAuthenticated) {
//       alert("You must be logged in as an admin.");
//       navigate("/login");
//       return;
//     }

//     if (!pdfFile) {
//       alert("Please upload a PDF file.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", pdfFile); // backend expects `file`

//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:8000/api/projects/upload/",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${auth.token}`, // ✅ Token added here
//           },
//         }
//       );

//       console.log("Upload successful:", response.data);
//       alert("PDF uploaded successfully!");
//       navigate("/admin"); // go back to dashboard
//     } catch (error) {
//       console.error("Upload error:", error);
//       alert("Failed to upload PDF.");
//     }
//   };

//   return (
//     <div className={styles.wrapper}>
//       <div className={styles.container}>
//         <h3 className={styles.heading}>Upload Project Report</h3>
//         <form onSubmit={handleSubmit} className={styles.form}>
//           <label htmlFor="report" className={styles.label}>
//             Select PDF File
//           </label>
//           <input
//             type="file"
//             id="report"
//             accept="application/pdf"
//             className={styles.fileInput}
//             onChange={handleFileChange}
//             required
//           />

//           <button type="submit" className={styles.submitButton}>
//             Submit
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ProjectReportPage;
import React, { useState, useContext } from "react";
import styles from "./ProjectReport.module.css";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProjectReportPage = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const { auth, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated || !auth.token) {
      alert("You must be logged in as an admin.");
      navigate("/login");
      return;
    }

    if (!pdfFile) {
      alert("Please select a PDF file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", pdfFile);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/projects/upload/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "Upload failed");
      }

      const result = await response.json();
      console.log("Upload successful:", result);
      alert("Project PDF uploaded successfully!");
      navigate("/admin"); // redirect to admin dashboard
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload project PDF. Please check if you're logged in as an admin.");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h3 className={styles.heading}>Upload Project Report</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="report" className={styles.label}>
            Select PDF File
          </label>
          <input
            type="file"
            id="report"
            accept="application/pdf"
            className={styles.fileInput}
            onChange={handleFileChange}
            required
          />
          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectReportPage;
