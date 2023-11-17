"use client";

import React, { ClassAttributes, InputHTMLAttributes } from "react";
import styles from "./TextField.module.css";

interface Props
  extends InputHTMLAttributes<HTMLInputElement>,
    ClassAttributes<HTMLInputElement> {
  label?: string;
  setValue?: (value: string) => void;
}

const TextField = React.forwardRef<HTMLInputElement, Props>(
  ({ label, className, setValue, ...props }, ref) => (
    <label className="flex-1">
      {label}
      {label && ":"}
      <input
        ref={ref}
        className={[className, styles.textField].join(" ")}
        {...props}
        onChange={
          setValue
            ? (e) => {
                setValue(e.target.value);
              }
            : props.onChange
        }
      />
    </label>
  )
);

TextField.displayName = "TextField";

export default TextField;
