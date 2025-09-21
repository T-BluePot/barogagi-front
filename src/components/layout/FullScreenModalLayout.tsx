import type { ReactNode } from "react";
import { CloseHeader } from "../common/headers/CloseHeader";

type FullScreenModalLayoutProps = {
  children?: ReactNode;
  onClose: () => void;
  backgroundColor?: string;
};

const FullScreenModalLayout = ({
  children,
  onClose,
  backgroundColor = "bg-gray-black",
}: FullScreenModalLayoutProps) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col w-full min-h-screen ${backgroundColor}`}
    >
      {/* 닫기 버튼 */}
      <CloseHeader onClick={onClose} isDarkBg={true} />
      {/* 컨텐츠 영역 */}
      <div className="flex flex-col flex-1 relative">{children}</div>
    </div>
  );
};

export default FullScreenModalLayout;
