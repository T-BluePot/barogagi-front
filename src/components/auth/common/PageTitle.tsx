import clsx from "clsx";

type PAGEROUTE = "auth" | "main" | "home";

export const PageTitle = ({
  type = "auth",
  title,
  subTitle,
}: {
  type?: PAGEROUTE;
  title: string;
  subTitle?: string;
}) => {
  const containerClass = clsx("flex flex-col w-full", {
    "gap-3 my-[60px]": type === "auth",
    "gap-2 mt-6 mb-8": type === "main" || type === "home",
  });

  const titleClass = clsx("text-left whitespace-pre-line", {
    "typo-title-01 text-white": type === "auth" || type === "home",
    "typo-title-02 text-gray-black": type === "main",
  });

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
