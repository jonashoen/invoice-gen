import React, { ButtonHTMLAttributes } from "react";

import styles from "./Button.module.css";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const Button: React.FC<Props> = ({
  children,
  disabled,
  loading,
  className,
  ...props
}) => (
  <button
    className={[className, styles.button].join(" ")}
    disabled={disabled || loading}
    {...props}
  >
    {children}
  </button>
);

export default Button;
