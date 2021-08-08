import "./style.scss";

interface IProps {
  label: string;
  name: string;
  register: (name: string) => void;
  error: any;
}

const Input = ({ label, register, name, error, ...rest }: IProps) => {
  return (
    <div className="input-block">
      <label htmlFor={name}>{label}</label>
      <input id={name} {...register(name)} {...rest} />
      {error && (
        <p className="error-message" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default Input;
