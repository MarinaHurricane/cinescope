import styles from "./SearchBar.module.css";
import toast from "react-hot-toast";

interface SearchBarProps {
  onSubmit: (query: string) => void;
}

export default function SearchBar({ onSubmit }: SearchBarProps) {
  const handleSubmit = (formData: FormData) => {
    const query = formData.get("query") as string;
    if (query === "") {
      toast("Please enter your search query.");
      return;
    }
    onSubmit(query);
  };
  return (
    <div className="search">
      <div>
        <img src="search.svg" alt="search" />
        <form className={styles.form} action={handleSubmit}>
          <input
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Search thtough thousands of movies..."
            autoFocus
          />
          <button className={styles.button} type="submit">
            Search
          </button>
        </form>
      </div>
    </div>
  );
}
