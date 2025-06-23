type Props = {
  label: string;
};

const TextButton = ({ label }: Props) => {
  const baseStyle = `px-4 py-3 typo-body cursor-pointer transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`;
  const typoStyle = `text-gray-50 hover:text-black break-words`;

  return (
    <button className={baseStyle}>
      <span className={typoStyle}>{label}</span>
    </button>
  );
};

export default TextButton;
