import { Sheet } from "react-modal-sheet";
import type { BottomModalLayoutProps } from "@/types/BottomModalTypes";

export const BottomModalLayout = ({
  isOpen,
  onClose,
  children,
}: BottomModalLayoutProps) => {
  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      detent="content-height"
      style={{
        zIndex: 100, // 추후 연동될 다른 페이지 및 모달들과 조정을 위함
      }}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>{children}</Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop
        className="fixed inset-0 bg-black/40 backdrop-blur-[1.5px] pointer-events-auto"
        onTap={onClose}
      />
    </Sheet>
  );
};
