import styles from "./FilterPanel.module.css";

export default function FilterPanel() {
  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Filter Projects</h2>

      {/* Category Filter */}
      <div className={styles.group}>
        <label htmlFor="category" className={styles.label}>
          Category
        </label>
        <select id="category" name="category" className={styles.select}>
          <option value="">-- Select Category --</option>
          <option value="robotics">Robotics</option>
          <option value="webdev">Web Development</option>
          <option value="ai_ml">AI / ML</option>
          <option value="monitoring">Monitoring</option>
          <option value="iot">IoT</option>
        </select>
      </div>

      {/* Start Date Filter */}
      <div className={styles.group}>
        <label htmlFor="startDate" className={styles.label}>
          Start Date
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          className={styles.dateInput}
        />
      </div>

      {/* Rating Filter */}
      <div className={styles.group}>
        <label htmlFor="rating" className={styles.label}>
          Rating
        </label>
        <select id="rating" name="rating" className={styles.select}>
          <option value="">-- Select Rating --</option>
          <option value="5">5</option>
          <option value="4">4</option>
          <option value="3">3</option>
          <option value="2">2</option>
          <option value="1">1</option>
        </select>
      </div>
      <div className={styles.group}>
        <label htmlFor="" className={styles.label}>
          Search by Name
        </label>
      </div>

      <button className={styles.button}>Show Results</button>
    </div>
  );
}
