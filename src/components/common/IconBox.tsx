import React from "react";

// 구글 메테리얼 아이콘을 이름으로 받아서 보여주는 전역 컴포넌트
// 예시: <IconBox name="home" width={24} height={24} />
interface IconBoxProps {
  name: string;
  width?: number;
  height?: number;
  className?: string;
}

const IconBox: React.FC<IconBoxProps> = ({
  name,
  width = 24,
  height = 24,
  className,
}) => {
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        className="material-icons"
        style={{ fontSize: width, width, height, lineHeight: `${height}px` }}
        aria-hidden="true"
      >
        {name}
      </span>
    </span>
  );
};

export default IconBox;
