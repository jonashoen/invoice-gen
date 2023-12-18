"use client";

import React, { TextareaHTMLAttributes } from "react";
import styles from "./TextArea.module.css";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  setValue?: (value: string) => void;
}

const TextArea = React.forwardRef<HTMLInputElement, Props>(
  ({ label, className, setValue, ...props }) => (
    <label className="flex-1">
      {label}
      {label && ":"}
      <textarea
        className={[className, styles.textArea].join(" ")}
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

TextArea.displayName = "TextArea";

export default TextArea;
