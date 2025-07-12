export const PageTitle = ({ title }: { title: string }) => {
  return (
    <span className="typo-title-01 my-[60px] text-white text-left whitespace-pre-line">
      {title}
    </span>
  );
};

export const PageTitleWithSub = ({
  title,
  subTitle,
}: {
  title: string;
  subTitle: string;
}) => {
  return (
    <div className="flex flex-col w-full gap-3 my-[60px]">
      <span className="typo-title-01 text-white text-left whitespace-pre-line">
        {title}
      </span>
      <span className="typo-body text-gray-20 text-left whitespace-pre-line">
        {subTitle}
      </span>
    </div>
  );
};
