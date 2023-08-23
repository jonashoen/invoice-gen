import React, { HTMLAttributes } from "react";

import styles from "./Container.module.css";

const Container: React.FC<HTMLAttributes<HTMLElement>> = ({
  children,
  className,
}) => <div className={[styles.container, className].join(" ")}>{children}</div>;

export default Container;
