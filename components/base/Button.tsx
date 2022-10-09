import { MouseEventHandler } from "react";
import { Colors, Size } from "../../types/components/Utils";
import styles from "./Button.module.scss";
export enum ButtonVariants {
  outlined = "outlined",
  text = "text",
  contained = "contained",
}

export type ButtonProps = {
  variant?: ButtonVariants;
  size?: Size;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  loading?: boolean;
  color?: Colors;
  children?: string;
};

export default function Button(props: ButtonProps) {
  const {
    variant = ButtonVariants.contained,
    size = Size.medium,
    color = Colors.primary,
    disabled = false,
    loading = false,
    children,
    onClick,
  } = props;

  const classes = [styles.button, styles[variant], styles[size], styles[color]];
  if (loading) classes.push(styles.loading);
  if (disabled) classes.push(styles.disabled);

  return (
    <button className={classes.join(" ")} onClick={onClick}>
      {children}
    </button>
  );
}
