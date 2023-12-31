"use client";

import { Dispatch, InputHTMLAttributes, SetStateAction, useState } from "react";
import TextField from "../TextField";

const CODE_LENGHT = 6;

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
}

const CodeInput: React.FC<Props> = ({ code, setCode, disabled }) => {
  const [codeFocused, setCodeFocused] = useState(false);

  return (
    <div className="flex justify-center">
      <div className="relative w-min">
        <div className="flex gap-4">
          {[...Array(6).fill(0)].map((_, i) => (
            <div className="w-[70px]" key={i}>
              <TextField
                value={code[i] ?? "•"}
                readOnly
                maxLength={1}
                disabled={disabled}
                className={[
                  "text-center aspect-square uppercase text-3xl",
                  (code.length === i ||
                    (code.length === CODE_LENGHT && i === CODE_LENGHT - 1)) &&
                    codeFocused &&
                    "!border-purple text-purple",
                ].join(" ")}
              />
            </div>
          ))}
        </div>

        <TextField
          value={code}
          setValue={(c) => {
            if (c.trim() === code || disabled) {
              return;
            }

            if (c.length > CODE_LENGHT) {
              setCode(c.substring(0, CODE_LENGHT - 1) + c.at(-1));
            } else {
              setCode(c);
            }
          }}
          className="absolute bottom-0 w-full opacity-0 text-3xl h-[70px]"
          required
          minLength={CODE_LENGHT}
          maxLength={CODE_LENGHT + 1}
          name="code"
          autoFocus
          onFocus={() => setCodeFocused(true)}
          onBlur={() => setCodeFocused(false)}
        />
      </div>
    </div>
  );
};

export default CodeInput;
export { CODE_LENGHT };
