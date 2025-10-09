import type { ReactNode } from "react";

type Props = {
  title: string;
  highlightText?: string;
  children?: ReactNode;
};

const ContentWrapper = ({ title, highlightText, children }: Props) => {
  return (
    <div className="w-full text-left">
      <div className="mb-2">
        <h1 className="typo-title-02">
          {title}{" "}
          {highlightText && (
            <span className="text-main-dark">{highlightText}</span>
          )}
        </h1>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default ContentWrapper;
