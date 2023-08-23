import { FormHTMLAttributes } from "react";

interface Props extends FormHTMLAttributes<HTMLFormElement> {
  onSubmit?: () => void;
}

const Form: React.FC<Props> = ({ children, onSubmit, className }) => (
  <form
    className={["flex flex-col", className].join(" ")}
    onSubmit={(e) => {
      e.preventDefault();

      if (onSubmit) {
        onSubmit();
      }
    }}
  >
    {children}
  </form>
);

export default Form;
