export const PageTitle = ({
  title,
  subTitle,
}: {
  title: string;
  subTitle?: string;
}) => {
  return (
    <div className="flex flex-col w-full gap-3 my-[60px]">
      <span className="typo-title-01 text-white text-left whitespace-pre-line">
        {title}
      </span>
      {subTitle && (
        <span className="typo-body text-gray-20 text-left whitespace-pre-line">
          {subTitle}
        </span>
      )}
    </div>
  );
};
