import React, { HTMLAttributes } from "react";
import styles from "./Chip.module.css";

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
