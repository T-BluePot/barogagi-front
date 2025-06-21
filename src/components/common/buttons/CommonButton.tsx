type ButtonProps = {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode; // 아이콘 slot 추가
  isDisabled?: boolean;
};

const Button = ({ label, onClick, icon, isDisabled = false }: ButtonProps) => {
  const baseStyle = `px-4 py-3 rounded-full w-full max-w-xl flex items-center justify-center typo-body focus:outline-none cursor-pointer transition-colors duration-200 ${
    isDisabled
      ? "bg-main-disable text-gray-50 cursor-not-allowed"
      : "bg-main text-black hover:bg-main-dark"
  }`;

  return (
    <button
      onClick={isDisabled ? undefined : onClick}
      className={baseStyle}
      disabled={isDisabled}
    >
      {icon && <span className="mr-2 flex items-center">{icon}</span>}
      <span className="break-words">{label}</span>
    </button>
  );
};

export default Button;
