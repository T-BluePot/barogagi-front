import type { ReactNode } from "react";
import { CloseHeader } from "@/components/common/headers/CloseHeader";
import { useNativeBack } from "@/utils/nativeBackHandler";

type FullScreenModalLayoutProps = {
  children?: ReactNode;
  onClose: () => void;
  backgroundColor?: string;
};

const FullScreenModalLayout = ({
  children,
  onClose,
  backgroundColor = "bg-white",
}: FullScreenModalLayoutProps) => {
  // 하드웨어 백 버튼: 이 컴포넌트가 마운트되어 있는 동안 닫기 동작으로 가로챔
  useNativeBack(true, onClose);

  return (
    <div
      className={`fixed inset-0 z-50 mx-auto flex w-full max-w-(--app-max-width) flex-col min-h-screen pt-safe pb-safe ${backgroundColor}`}
    >
      {/* 닫기 버튼 */}
      <CloseHeader onClick={onClose} isHeaderDark={false} />
      {/* 컨텐츠 영역 - 스크롤 가능 */}
      <div className="flex flex-col flex-1 overflow-y-auto">{children}</div>
    </div>
  );
};

export default FullScreenModalLayout;
