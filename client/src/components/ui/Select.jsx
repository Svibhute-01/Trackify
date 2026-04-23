import inputStyles from "./Input.module.css";
import styles from "./Select.module.css";

function Select({ label, error, hint, id, children, className = "", ...rest }) {
  const inputId = id || rest.name;
  return (
    <div className={`${inputStyles.group} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={inputStyles.label}>
          {label}
        </label>
      )}
      <div className={styles.wrapper}>
        <select
          id={inputId}
          className={`${inputStyles.input} ${styles.select} ${error ? inputStyles.invalid : ""}`}
          {...rest}
        >
          {children}
        </select>
        <span className={styles.chevron}>▾</span>
      </div>
      {error ? (
        <span className={inputStyles.error}>{error}</span>
      ) : hint ? (
        <span className={inputStyles.hint}>{hint}</span>
      ) : null}
    </div>
  );
}

export default Select;
