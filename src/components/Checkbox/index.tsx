import React, {
  ClassAttributes,
  Dispatch,
  InputHTMLAttributes,
  SetStateAction,
} from "react";
import Container from "@/components/Container";

interface Props
  extends InputHTMLAttributes<HTMLInputElement>,
    ClassAttributes<HTMLInputElement> {
  setValue: Dispatch<SetStateAction<boolean>>;
  label?: string;
}

const Checkbox: React.FC<Props> = ({ checked, setValue, label }) => {
  return (
    <label
      className="flex items-center select-none cursor-pointer w-max"
      onClick={() => setValue((c) => !c)}
    >
      <Container className="flex mr-2 !inline-flex !p-0 !w-[32px] !h-[32px] items-center justify-center">
        <p>{checked && "\u274C"}</p>
      </Container>
      <span>{label}</span>
    </label>
  );
};

export default Checkbox;
