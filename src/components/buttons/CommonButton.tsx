type ButtonProps = {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
};

const Button = ({ label, onClick, variant = "primary" }: ButtonProps) => {
  const baseStyle = "px-4 py-2 rounded font-semibold focus:outline-none";
  const variants = {
    primary: "bg-main-dark text-white hover:bg-blue-700",
    secondary: "bg-main-disable text-gray-800 hover:bg-gray-300",
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]}`}>
      {label}
    </button>
  );
};

export default Button;
