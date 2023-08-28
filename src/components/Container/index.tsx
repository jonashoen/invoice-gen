import React, { HTMLAttributes } from "react";
import styles from "./Container.module.css";

const Container: React.FC<HTMLAttributes<HTMLElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={[styles.container, className].join(" ")} {...props}>
    {children}
  </div>
);

export default Container;
