import styles from "./Input.module.css";

function Input({
  label,
  error,
  hint,
  id,
  className = "",
  ...rest
}) {
  const inputId = id || rest.name;
  return (
    <div className={`${styles.group} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`${styles.input} ${error ? styles.invalid : ""}`}
        {...rest}
      />
      {error ? (
        <span className={styles.error}>{error}</span>
      ) : hint ? (
        <span className={styles.hint}>{hint}</span>
      ) : null}
    </div>
  );
}

export default Input;
