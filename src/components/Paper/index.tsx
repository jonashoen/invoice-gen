import React, { HTMLAttributes } from "react";
import styles from "./Paper.module.css";

const Paper: React.FC<HTMLAttributes<HTMLElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={[className, styles.paper].join(" ")} {...props}>
    {children}
  </div>
);

export default Paper;
