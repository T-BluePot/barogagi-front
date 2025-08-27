import clsx from "clsx";

type PAGEROUTE = "auth" | "main";

export const PageTitle = ({
  type = "auth",
  title,
  subTitle,
}: {
  type?: PAGEROUTE;
  title: string;
  subTitle?: string;
}) => {
  const containerClass = clsx(
    "flex flex-col w-full",
    type === "auth" ? "gap-3 my-[60px]" : "gap-2"
  );

  const titleClass = clsx(
    "text-left whitespace-pre-line",
    type === "auth"
      ? "typo-title-01 text-white"
      : "typo-title-02 text-gray-black"
  );

  const subTitleClass = clsx(
    "text-left whitespace-pre-line",
    type === "auth" ? "typo-body text-gray-20" : "typo-description text-gray-80"
  );
  return (
    <div className={containerClass}>
      <span className={titleClass}>{title}</span>
      {subTitle && <span className={subTitleClass}>{subTitle}</span>}
    </div>
  );
};
