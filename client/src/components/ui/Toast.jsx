import { createContext, useCallback, useContext, useState } from "react";
import styles from "./Toast.module.css";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, type = "info", duration = 3500) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration > 0) {
        setTimeout(() => remove(id), duration);
      }
      return id;
    },
    [remove]
  );

  const api = {
    show: push,
    success: (m, d) => push(m, "success", d),
    error: (m, d) => push(m, "error", d),
    info: (m, d) => push(m, "info", d),
    dismiss: remove,
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className={styles.region} aria-live="polite">
        {toasts.map((t) => {
          const Icon =
            t.type === "success" ? FaCheckCircle :
            t.type === "error" ? FaExclamationCircle :
            FaInfoCircle;
          return (
            <div key={t.id} className={`${styles.toast} ${styles[t.type]}`}>
              <Icon className={styles.icon} />
              <span className={styles.message}>{t.message}</span>
              <button className={styles.close} onClick={() => remove(t.id)} aria-label="Dismiss">
                <FaTimes />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
