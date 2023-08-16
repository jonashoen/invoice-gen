import React, { HTMLAttributes, InputHTMLAttributes } from "react";
import styles from "./Chip.module.css";
import Container from "../Container";

const Chip: React.FC<HTMLAttributes<HTMLElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={[className, styles["outer-chip"]].join(" ")}>
    <div className={styles.chip} {...props}>
      {children}
    </div>
  </div>
);

export default Chip;
