import React, { ChangeEventHandler, useCallback, useEffect, useRef } from "react";
import { composeClasses } from "../utils";
import styles from "./TextField.module.scss";
export interface TextFieldProps {
  value?: string;
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  type?: string;
  error?: string | boolean;
}

export default function TextField(props: TextFieldProps) {
  const {
    type,
    placeholder,
    value,
    error,
    onChange: inputChangeHandler,
    onFocus: inputFocusHandler,
    onBlur: inputBlurHandler,
  } = props;
  const ref = useRef<HTMLInputElement>();

  const blurHandler = useCallback((e: FocusEvent): any => {
    const target = e.target as HTMLInputElement;
    if (target.value) target.classList.add(styles.dirty);
    else target.classList.remove(styles.dirty);
  }, []);

  useEffect(() => {
    const input = ref.current;
    if (!input) return;

    input.addEventListener("blur", blurHandler);
    return () => input.removeEventListener("blur", blurHandler);
  }, [blurHandler]);

  const placeholderText =
    error && typeof error === "string" ? `${placeholder} - ${error}` : placeholder;

  return (
    <label className={composeClasses(styles.custom_field, error ? styles.error : "")}>
      <input
        value={value}
        onChange={inputChangeHandler}
        type={type ?? "string"}
        placeholder="&nbsp;"
        onFocus={inputFocusHandler}
        onBlur={inputBlurHandler}
      />
      <span className={styles.placeholder}>{placeholderText}</span>
      <span className={styles.border}></span>
    </label>
  );
}
