import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>Powered by the TMDB API</p>
      <p className={styles.subtext}>
        Built by Maryna Ishchenko ·{" "}
        <a
          href="https://github.com/MarinaHurricane"
          className={styles.link}
        >
          GitHub
        </a>
      </p>
    </footer>
  );
}
