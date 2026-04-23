import styles from "./Spinner.module.css";

function Spinner({ size = 18, color }) {
  const style = { width: size, height: size, borderWidth: Math.max(2, size / 9) };
  if (color) style.borderTopColor = color;
  return <span className={styles.spinner} style={style} />;
}

export default Spinner;
