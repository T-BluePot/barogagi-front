type ButtonProps = {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode; // 아이콘 slot 추가
};

const Button = ({ label, onClick, icon }: ButtonProps) => {
  const baseStyle =
    "px-4 py-3 rounded-full w-full flex items-center justify-center typo-body focus:outline-none cursor-pointer transition-colors duration-200 bg-main text-black hover:bg-main-dark";

  return (
    <button onClick={onClick} className={baseStyle}>
      {icon && <span className="mr-2 flex items-center">{icon}</span>}
      {label}
    </button>
  );
};

export default Button;
