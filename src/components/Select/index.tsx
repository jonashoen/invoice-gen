import React, { SelectHTMLAttributes } from "react";
import styles from "./Select.module.css";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  setValue?: (value: string) => void;
  options: { value?: number | string; text: string }[];
  loading?: boolean;
}

const Select: React.FC<Props> = ({
  label,
  className,
  setValue,
  options,
  loading,
  disabled,
  ...props
}) => (
  <label className="flex-1">
    {label}
    {label && ":"}
    <select
      className={[className, styles.select, loading && "animate-wiggle"].join(
        " "
      )}
      disabled={loading || disabled}
      {...props}
      onChange={
        setValue
          ? (e) => {
              setValue(e.target.value);
            }
          : props.onChange
      }
    >
      <option value="" disabled hidden>
        {loading ? "lädt..." : "Bitte wählen"}
      </option>
      {options.map((option) => (
        <option
          key={option.value || option.text}
          value={option.value || option.text}
        >
          {option.text}
        </option>
      ))}
    </select>
  </label>
);

export default Select;
