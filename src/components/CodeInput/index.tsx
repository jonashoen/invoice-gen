import { Dispatch, SetStateAction, useEffect, useState } from "react";
import TextField from "../TextField";

const CODE_LENGHT = 6;

interface Props {
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
}

const CodeInput: React.FC<Props> = ({ code, setCode }) => {
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
                className={[
                  "text-center aspect-square uppercase text-3xl",
                  code.length === i &&
                    codeFocused &&
                    "!border-purple text-purple",
                ].join(" ")}
              />
            </div>
          ))}
        </div>

        <TextField
          value={code}
          setValue={(c) => c.trim() !== code && setCode(c)}
          className="absolute bottom-0 w-full opacity-0 text-3xl h-[70px]"
          required
          minLength={CODE_LENGHT}
          maxLength={CODE_LENGHT}
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
