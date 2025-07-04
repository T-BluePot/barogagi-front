type TextTagProps = {
  label: string;
};

export const TextTag = ({ label }: TextTagProps) => {
  const textClass = "text-gray-40 typo-tag";

  return <span className={textClass}>{label}</span>;
};
