import styles from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={styles.grid}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className={styles.card} />
      ))}
    </div>
  );
}
