import React, { SelectHTMLAttributes } from "react";
import styles from "./Select.module.css";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  setValue?: (value: string) => void;
  options: { value?: number | string; text: string }[];
}

const Select: React.FC<Props> = ({
  label,
  className,
  setValue,
  options,
  ...props
}) => (
  <label className="flex-1">
    {label}
    {label && ":"}
    <select
      className={[className, styles.select].join(" ")}
      {...props}
      onChange={
        setValue
          ? (e) => {
              setValue(e.target.value);
            }
          : props.onChange
      }
    >
      <option value="" selected disabled hidden>
        Bitte wählen
      </option>
      {options.map((option) => (
        <option value={option.value || option.text}>{option.text}</option>
      ))}
    </select>
  </label>
);

export default Select;
