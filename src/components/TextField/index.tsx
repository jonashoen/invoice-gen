import React, { InputHTMLAttributes } from "react";
import styles from "./TextField.module.css";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const TextField: React.FC<Props> = ({ label, className, ...props }) => (
  <label className="flex-1">
    {label}
    {label && ":"}
    <input className={[className, styles.textField].join(" ")} {...props} />
  </label>
);

export default TextField;
