import IconBox from "@/components/common/IconBox";

import type { ReactNode } from "react";

type Props = {
  title: string;
  highlightText?: string;
  onClick?: () => void;
  isArrowVisible?: boolean;
  children?: ReactNode;
};

const ContentWrapper = ({
  title,
  highlightText,
  onClick,
  isArrowVisible = false,
  children,
}: Props) => {
  return (
    <div className="w-full text-left mb-8">
      <div className="mb-2 flex gap-2">
        <h1 className="typo-title-02">
          {title}{" "}
          {highlightText && (
            <span className="text-main-dark">{highlightText}</span>
          )}
        </h1>
        {isArrowVisible && onClick && (
          <button onClick={onClick} className="flex items-center">
            <IconBox
              name="arrow_forward_ios"
              width={16}
              weight={100}
              className="text-gray-30"
            />
          </button>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default ContentWrapper;
