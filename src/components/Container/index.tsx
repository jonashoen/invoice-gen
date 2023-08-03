import React from "react";

import styles from "./Container.module.css";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<Props> = ({ children, className }) => (
  <div className={[className, styles.container].join(" ")}>{children}</div>
);

export default Container;
