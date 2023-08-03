import React from "react";
import styles from "./Paper.module.css";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Paper: React.FC<Props> = ({ children, className }) => (
  <div className={[className, styles.paper].join(" ")}>{children}</div>
);

export default Paper;
