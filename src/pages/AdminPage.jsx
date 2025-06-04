import ProjectList from "../components/ProjectList";
import styles from "./AdminPage.module.css";
import FilterPanel from "../components/FilterPanel";
import { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // ✅ single import

export default function AdminPage() {
  const navigate = useNavigate();
  const { isAuthenticated, auth, logout } = useContext(AuthContext); // <-- add logout

  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const searchContainerRef = useRef(null);

  // ✅ Authenticated fetch only
  useEffect(() => {
    if (!isAuthenticated || !auth?.token) {
      navigate("/login");
      return;
    }

    fetch("http://127.0.0.1:8000/api/projects/?format=json", {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch projects.");
        }
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

  // 🔐 Don't render anything if not authenticated
  if (!isAuthenticated) return null;

  const handleSearchChange = (e) => {
    const rawInput = e.target.value;
    setSearchTerm(rawInput);

    const keywords = rawInput
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (keywords.length === 0) {
      setFilteredResults([]);
    } else {
      const results = projects.filter((project) => {
        const fields = [project.project_title, project.domain].join(" ").toLowerCase();
        return keywords.some((word) => fields.includes(word));
      });
      setFilteredResults(results);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredResults([]);
  };

  const togglePanel = () => {
    setIsPanelVisible((prev) => !prev);
  };

  // if (loading) return <p>Loading projects...</p>;
  // if (error) return <p>Error: {error}</p>;
  if (projects.length === 0 && !loading) {
    setProjects([
      {
        "project_id": 1,
        "file_name": "project_report (1).pdf",
        "project_title": "Land Use Land Cover classification and change prediction using Artificial Neural Network in python",
        "students": [
          "Dubey Amit Radheshyam"
        ],
        "colleges": [
          "Fr. Conceicao Rodrigues College of Engineering Bandra (west) Mumbai - 400050"
        ],
        "guide_name": "Hariesh Pesara",
        "domain": "AI",
        "abstract": "The report summarizes the research and solution of a problem statement given to me during my internship whose objective was to make use of Artificial Neural network and other Machine learning and deep learning methodology to perform Land use land cover (LULC) classification of a multispectral satellite image into various labels and predict the LULC changes. Hence the approach to the problem was divided into 2 stages first being learning the concept of satellite imagery and techniques used to make the LULC maps and the second was to generate a methodology that could make use of the LULC maps as reference and predict the changes that could be seen in the coming future with an acceptable accuracy specifically using Artificial Neural Network. After thorough research and understanding the basics of remote sensing and the properties of a satellite image along with the different types of data that could be accessible and learning various methods in deep learning and machine learning that could be used to achieve the desire application the objectives were achieved."
      },
      {
        "project_id": 2,
        "file_name": "project_report (2).pdf",
        "project_title": "Characterization of Water Quality and Assessment of Long Term Trends in River Water Quality",
        "students": [
          "Anshu Pundir"
        ],
        "colleges": [
          "Amity University"
        ],
        "guide_name": "J Srinivasulu",
        "domain": "Water Resources",
        "abstract": "The Ganga basin is the lifeline of millions of people in India hence it becomes important to study the water quality parameters of these river systems and their long term trends. A detailed characterization of water quality parameters is done using Landsat 8 and Sentinel 2 TOA product as TOA was found to be better suited for studies involving reflectance characterization of water bodies. A Pollution Index (NIR – Red) / (NIR + Red) is suggested for studying long term trend of pollution. It has been found that Pollution Index should be avoided in river waters with high turbidity as NIR has shown some sensitivity towards turbidity as well. A Modified Normalized Difference Turbidity Index (MNDTI (B4 – B2) / (B4 + B2)) is suggested as it has shown to have a higher positive correlation with turbidity (r = 0.55) and a higher negative correlation with TDS (r = - 0.41) compared to the traditional NDTI which had r values of 0.51 and - 0.31 with turbidity and TDS respectively. Average visible reflectance is suggested for studying turbidity trends especially in highly polluted waters where the conventional NDTI and the MNDTI have shown errors. Based on the findings the long term trend of Yamuna at Vishramghat Mathura Ganga at Jajmau Kanpur and Hindon at Nagwa UP was carried out. Yamuna at Vishramghat has shown an increase in pollution from 1989 till 2010 and a stable trend from thereon turbidity on the other hand has continuously increased from 1989 till 2019 indicating either an increase in soil erosion or increase in organic sediment load in the river water. The Pollution Index has shown positive values from 2005 onwards with values remaining below 0.05. The Pollution Index value of Ganga at Jajmau Kanpur never showed positive values and has shown a sudden improvement in water quality after 2019 while the turbidity in the river has remained more or less the same in 2021 compared to 1988. Hindon water at Nagwa is highly polluted. In the long term Hindon at Nagwa has shown a deterioration in water quality in terms of both pollution and turbidity compared to 1989. The pollution Index value is as high as 0.34 in 2019."
      },
      {
        "project_id": 3,
        "file_name": "project_report (3).pdf",
        "project_title": "Study of Remote Sensing Ground Station at NRSC/ISRO",
        "students": [
          "Sadhvika Kadari"
        ],
        "colleges": [
          "IIT Kharagpur"
        ],
        "guide_name": "Dr. A. N. Satyanarayana",
        "domain": "Research based or innovation",
        "abstract": "The procedure for Satellite Data acquisition system of the Remote Sensing Satellite Ground Station and functioning of various systems required for data acquisition are explained in this report. The Antenna RF Servo Electronics Data Ingest systems and boresight system is studied and focus is laid on the operation procedure. The technical speciﬁcations required for the procedure is mentioned. The daily operations of Real time data acquisition are explained."
      },
      {
        "project_id": 4,
        "file_name": "project_report (4).pdf",
        "project_title": "A Project/ Study on Atmospheric Lightning measurements from space and its comparison with ground-based data over India",
        "students": [
          "Aman Agarwal",
          "Priyadarshini Agrawal"
        ],
        "colleges": [
          "Dayalbagh Educational Institute",
          "NRSC Hyderabad"
        ],
        "guide_name": "Dr. Alok Toari",
        "domain": "Research based or innovation",
        "abstract": "Understanding atmospheric lightning flashes and their occurrences is one of the most important aspects of the Earth’s climate science. Real-time lightning data have profound importance in climate science and air-quality research apart from lightning being one of the major natural disasters. Keeping these in view National Remote Sensing Centre (NRSC) Indian Space Research Organization has established a lightning detection sensor (LDS) network for nationwide detection of lightning occurrences with 42 sensors installed until August 2022. Though there is no space borne measurements over India apart from the Lightning Imaging Sensor (LIS) on the International Space Station (ISS) hereafter referred to as ISS-LIS which detects lightning from space by capturing the optical scattered light emitted from the top of the clouds. The objective of this work is to quantify the similarities and deviations between these two distinct lightning detection technologies by comparing the LDS cloud-to-ground flashes to the ISS-LIS measurements. A full month data collected from these two different instruments during April 2020 is assessed for their efficacies and limitations."
      },
      {
        "project_id": 5,
        "file_name": "project_report (5).pdf",
        "project_title": "Aircraft Detection and Classification by Using Satellite Imagery with AI/Ml techniques",
        "students": [
          "Raj Rohit"
        ],
        "colleges": [
          "Birsa Institute of Technology Sindri"
        ],
        "guide_name": "ARAVINDA KUMAR P",
        "domain": "AI",
        "abstract": "Airplane Classification is one of the major problem in point object classification from High Resolution satellite imagery. Satellite images are optical and non opti- cal. Feature extraction from satellite image is more feasible with line features like roadrailways and polygon feature like rivers solar farms etc. At the same time point features like boatairplanes are difficult to extract due to less information to noise ration in sample dataset. Simple model will learn less and put lot of bias for point feature extraction whereas complex model will over train and perform poorly for new dataset. Hence careful analysis of sample images has to be per- formed before putting the dataset for training. Conventional machine learning models and cnn based deep learning models have been explored. Dataset has been gathered from Kaggle which is similar to Bhuvan HR data. Labelling has been done and provided in Json format. A classifier is presented as the result of this exercise. This will act as a framework for point feature classification from High Resolution Satellite imagery."
      },
      {
        "project_id": 6,
        "file_name": "project_report (6).pdf",
        "project_title": "Exploring Different GAN Architectures for Cloud Cover Removal from Remote Sensing Imagery",
        "students": [
          "Arrun Sivasubramanian"
        ],
        "colleges": [
          "Amrita School of Engineering Coimbatore"
        ],
        "guide_name": "Dr. Jaya Saxena",
        "domain": "AI",
        "abstract": "The high resolution of remote sensing images has been tremendously utilized in several surveillance applications. However cloud cover haze and shadows inevitably affect remote sensing imagery. Hence removing the cloud from these satellite images is an essential pre- processing step before any effective analysis. With the increasing popularity of deep learning in several image processing tasks several architectures have been proposed to perform this task. However the existing benchmarks do not eliminate all occlusions when thick clouds overlay the land features. Thus in this work we propose a novel architecture called RS_CloudGAN to address this problem. The model has been trained on paired open-source RICE dataset images for thin and thick cloud removal. The generator of the architecture consists of different convolution heads stacked together to generate feature maps and a PatchGAN discriminator. The performance has been validated using Peak Signal Noise Ratio (PSNR) and the Structural Similarity Index (SSIM). The performance of RS_Cloud GAN is compared with the existing models such as Pix2Pix Spatial Attention (SpA) GAN and DeCloud GAN. The proposed model outperforms the current benchmark state-of-the-art results on the thick cloud removal by almost 3 dB in the PSNR ratio and 4% on the structural similarity index. Experimental validation of the trained model on unseen LandSat8 satellite data with different cloud cover percentages is also performed. These images are from three different geographical regions to investigate real-time performance. Finally the Class Activation Maps (CAM) for these predictions have been included for the explainability of the model."
      },
      {
        "project_id": 7,
        "file_name": "project_report (7).pdf",
        "project_title": "DISEASE OUTBREAK PREDICTION OF TELANGANA STATE AT BLOCK LEVEL USING GIS",
        "students": [
          "Neelagiri Hema Siva Latha"
        ],
        "colleges": [
          "SCHOOL OF SPATIAL INFORMATION TECHNOLOGY INSTITUTE OF SCIENCE & TECHNOLOGY JAWAHARLAL NEHRU TECHNOLOGICAL UNIVERSITY KAKINADA"
        ],
        "guide_name": "Dr. Stutee Gupta, Mr. Killi Srinivas",
        "domain": "Research based or innovation",
        "abstract": "The main path for Disease which is caused due to the presence of faecal coliform bacteria to spread in the humans is through the water. Most research right now is to analyze Disease- Ground water Toilet and Population density relationship over Telangana region at block level. Ordinary Least Squares (OLS) and Geographically Weighted Regression (GWR) models were used to determine the spatial relationship and recognize the Disease situation by utilizing NRDWP Faecal Coliform data Census Population data and Swachh Bharat IHHT data in the Telangana region at Block level. The study showed that Disease- Ground water and Disease – Toilet human relationship were basically non-stationary. This implies in certain blocks higher Disease Occurrence were related with Shallow Ground water depth and less number of Toilets and more number of Population however in certain blocks higher Disease occurrences were identified even at deep Ground water depths also at the blocks where there are more number of Toilets and also at the blocks even with less population density depending upon some other criteria. The result shows that GWR model provided a better model fit over the OLS model. Comparing both models with the AICc value reduced from 745.6 (for OLS model) to 259.4 (for GWR model) and the R2 value increased from 0.1 (for OLS model) to 0.7 (for GWR model) revealed that GWR model is best to spatially determine the relationship of faecal coliform Disease occurrence with Ground water Toilet and Population density."
      },
      {
        "project_id": 8,
        "file_name": "project_report (8).pdf",
        "project_title": "Developing an MLOps Platform using OpenStack and Apache SparkML",
        "students": [
          "Arya Pandey"
        ],
        "colleges": [
          "Delhi Technological University (DTU)"
        ],
        "guide_name": "Syed Shadab",
        "domain": "ML",
        "abstract": "This project focuses on building an MLOps platform using OpenStack and Apache SparkML.  It involves installing and configuring Apache Spark and OpenStack, preprocessing the Iris dataset, training and testing linear regression and classification models (using Naive Bayes), and evaluating their performance. The project highlights the use of Spark MLlib for machine learning tasks and addresses limitations such as the lack of a file management system in Apache Spark."
      },
      {
        "project_id": 9,
        "file_name": "project_report (9).pdf",
        "project_title": "SYNCHRONOUS & ASYNCHRONOUS DESIGN ASPECTS on Design and manufacturing of CFRP reflector for use in Ground station Antenna systems",
        "students": [
          "Ishita Kesarwani",
          "Riya Gupta"
        ],
        "colleges": [
          "Banasthali Vidyapith",
          "Banasthali Vidyapith"
        ],
        "guide_name": "J. TIRUPATHAIAH",
        "domain": "Technology Demonstration",
        "abstract": "In this project we mainly focus on the CFRP reflector for the cassegrain feed antenna system. In telecommunications and radar a cassegrain antenna is a parabolic antenna in which a feed antenna is mounted at or behind the surface of the concave main parabolic reflector dish and is aimed at a smaller convex secondary reflector suspended in front of the primary reflector. The beam of radio waves from the feed illuminates the secondary reflector which reflects it back to the main reflector dish which reflects it forward again to form the desired beam. The cassegrain design is widely used in parabolic antennas particularly in large antennas such as those in satellite ground stations radio telescopes and communication satellites. As a part of modernization of Antenna systems it is proposed to develop antenna reflector with CFRP Composite material considering their unique advantages in terms of high modulus per material density specific strength specific stiffness low coefficient of thermal expansion which results in negligible deformation due to thermal gradient helps in improvement of antenna gain and reduction in complexity of servo drive components as compared to aluminium reflector."
      },
      {
        "project_id": 10,
        "file_name": "project_report (10).pdf",
        "project_title": "MERN based Visualization and AIS ship Association to aid Maritime Surveillance",
        "students": [
          "Nandini Chhajed",
          "Archit Badjatya"
        ],
        "colleges": [
          "Medi-Caps University"
        ],
        "guide_name": "Smt. Jayasri PV and Mr. Samvram Sahu",
        "domain": "Technology Demonstration",
        "abstract": "The main objective of this project is to build a complete webpage that interacts with a database and to populate a map view with the ship information using Leaflet JS and Django. It is also required to give options to the user for querying various parameters which will filter the data and change the view accordingly. A polygon-based input from the map view will be taken. The users will get a unique interface where they can perform different functionalities based on requirements and gather knowledge of ships and services. This is a hybrid application that is it is not a fully automated process and thus also requires a significant manual effort by users."
      },
      {
        "project_id": 11,
        "file_name": "project_report (11).pdf",
        "project_title": "Study and Analysis of Viterbi Decoding Logic To Implement on FPGA",
        "students": [
          "Yogita"
        ],
        "colleges": [
          "Banasthali Vidyapith"
        ],
        "guide_name": "Smt. CS Padmavathy",
        "domain": "Technology Demonstration",
        "abstract": "Convolutional encoding is a forward error correction technique that is used to do correction of the errors at the receivers end. There are two decoding algorithms used for the decoding of the convolutional codes namely Viterbi Algorithm and Sequential Algorithm. Sequential Algorithm is advantageous as it can perform very well with long constraint length whereas on the other hand Viterbi Algorithm is best technique for decoding of convolutional codes but with limited constraint lengths. Viterbi Algorithm is widely deployed in many wireless communication systems in order to improve the limited capacity of the communication channels. Because the communications channels in wireless systems can be much more hostile than in “wired” systems voice and data must use forward error correction coding to reduce the probability of channel effects corrupting the information being transmitted. It is used to detect signals in communications channels with memory and to decode sequential error control codes that are used to enhance the performance of digital communication systems. Though various platforms can be used for realizing Viterbi Decoder including Field Programmable Gate Array (FPGAs) or Digital Signal Processing (DSP) chips but in this project benefit of using an FPGA to Implement Viterbi Decoding Algorithm has been described. The advantages of the FPGA approach to DSP Implementation include higher sampling rates than are available from traditional DSP chips lower costs than an ASIC. The FPGA also adds design flexibility and adaptability with optimal device utilization conserving both board space and system power that is often not the case with DSP chips."
      },
      {
        "project_id": 12,
        "file_name": "project_report (12).pdf",
        "project_title": "SAR Image Colorization for Comprehensive Insight Using Deep Learning Models",
        "students": [
          "R. VARUN",
          "V. MOKSHYAGNA"
        ],
        "colleges": [
          "Vignana Bharathi Institute of Technology",
          "Vignana Bharathi Institute of Technology"
        ],
        "guide_name": "Dr. Jaya Saxena",
        "domain": "DEEP LEARNING",
        "abstract": "Synthetic Aperture Radar (SAR) images are widely used in remote sensing due to their ability to capture high-resolution images in various weather conditions. However these images are typically grayscale which limits their visual interpretation and application in certain fields. Colorizing SAR images can significantly improve their visual quality and provide more insightful analysis. This project explores deep learning techniques for SAR image colorization aiming to enhance the visual representation of SAR data without compromising its inherent features. This project proposes a novel approach for SAR image colorization using deep learning architecture. We have implemented three models namely U-Net DeepLabV3+ and Seg-Net Architectures for the colorization of SAR images. Further the models’ performances are evaluated through metrics such as PSNR SSIM and IoU. The results demonstrated that the different deep learning architectures effectively learned to segment the SAR images providing detailed colorized outputs that visually represent different land cover classes. The effectiveness of the model is further validated by comparing its segmentation results with ESA World Cover class definitions (Ground Truth) and visualizing the predictions. This approach showcases the potential of DL Models for enhancing SAR image interpretation by providing clear colorized visualizations that can aid in applications such as land use analysis and disaster management."
      },
      {
        "project_id": 13,
        "file_name": "project_report (13).pdf",
        "project_title": "Time-Series study Using Spaceborne Differential Interferometry (DINSAR) Technique",
        "students": [
          "R KAARTHIKEYAN"
        ],
        "colleges": [
          "Indian Institute of Technology (Indian School of Mines) Dhanbad"
        ],
        "guide_name": "Prof. Mohammad Soyeb Alam",
        "domain": "Geosciences",
        "abstract": "In the present work Spaceborne DInSAR Time Series (DTS) is applied in one of the major prime coking coals producing district of India which is also known as coal capital of India for detection and monitoring of land surface and built-up area deformation due to various reasons. Prefeasibility for DInSAR was carried out keeping in view the LULC land surface Topography and system characteristics. LULC characterization shows significant portion of study area covers with good scatterers in terms of built-up area and barren land. Further Topographic characterization show that most part of the area is flat. Moderate to steep slope can be seen in some part of the study area. Furthermore System characterization shows that suitable InSAR data sets (s) from different current 2nd generation satellite SAR missions is available in different modes of acquisitions with varying look angles particularly for future acquisitions. Pre-feasibility (in terms of LULC Topographic and System characterization) for DInSAR encouraged us to use it for the study area. Further DInSAR Time Series results detect a fast concentric fringe in the study area during the study period which is developing in space and time. Detected fast concentric fringe represents subsidence trough which is very near to one of the largest underground coal mine namely Moonidih. Therefore detected fast concentric fringe may be represented by mining subsidence trough."
      }]
    )
    
  }
  return (
    <div className={styles.pageContainer}>
      <div
        className={`${styles.filterPanel} ${isPanelVisible ? styles.slideIn : styles.slideOut
          }`}
      >
        <FilterPanel />
      </div>
      <div className={styles.heading}>
        <h1 className={styles.pageTitle}>Admin Projects Overview</h1>
        <div className={styles.options}>
          <div className={styles.searchContainer} ref={searchContainerRef}>
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
            onClick={() => {
              navigate("/projectreport");
            }}
          >
            Add Project
          </button>
          <button className={styles.remove}>Remove Project</button>
          <button
            className={styles.logout}
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Log Out
          </button>
        </div>
      </div>
      <ProjectList projects={searchTerm ? filteredResults : projects} />
    </div>
  );
}
