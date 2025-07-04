type TextTagProps = {
  label: string;
  hasHash?: boolean;
};

export const TextTag = ({ label, hasHash = true }: TextTagProps) => {
  const textClass = "text-gray-40 typo-tag";

  return (
    <div className="flex justify-center items-center gap-1">
      {hasHash && <span className={textClass}>#</span>}
      <span className={textClass}>{label}</span>
    </div>
  );
};
