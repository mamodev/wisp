import { ChangeEventHandler, useCallback, useEffect, useRef } from "react";
import styles from "./TextField.module.scss";
export interface TextFieldProps {
  value?: string;
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  label?: string;
}

export default function TextField(props: TextFieldProps) {
  const ref = useRef<HTMLInputElement>();

  const inputBlurHandler = useCallback((e: FocusEvent): any => {
    const target = e.target as HTMLInputElement;
    if (target.value) target.classList.add(styles.dirty);
    else target.classList.remove(styles.dirty);
  }, []);

  useEffect(() => {
    const input = ref.current;
    if (!input) return;

    input.addEventListener("blur", inputBlurHandler);
    return () => input.removeEventListener("blur", inputBlurHandler);
  }, []);

  return (
    <label className={styles.custom_field}>
      <input type="password" placeholder="&nbsp;" />
      <span className={styles.placeholder}>Enter Password</span>
      <span className={styles.border}></span>
    </label>
  );
}
