interface Props {
  children: React.ReactNode;
  onSubmit?: () => void;
  className?: string;
}

const Form: React.FC<Props> = ({ children, onSubmit, className }) => (
  <form
    className={className}
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
