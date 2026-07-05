import { Sheet } from "react-modal-sheet";
import type { BottomModalLayoutProps } from "@/types/BottomModalTypes";
import { useNativeBack } from "@/utils/nativeBackHandler";

export const BottomModalLayout = ({
  isOpen,
  onClose,
  children,
}: BottomModalLayoutProps) => {
  // 하드웨어 백 버튼: 모달이 열려있는 동안 닫기 동작으로 가로챔
  useNativeBack(isOpen, onClose);

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      detent="content-height"
      style={{
        zIndex: 100, // 추후 연동될 다른 페이지 및 모달들과 조정을 위함
        // 웹 브라우저에서 시트가 모바일 프레임 폭을 넘지 않도록 제한
        maxWidth: "var(--app-max-width)",
        margin: "0 auto",
      }}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          {/* Sheet는 화면 바닥에서 올라오므로 콘텐츠 하단이 폰 하단바(제스처 바)에 가림.
              pb-safe로 safe-area 만큼 패딩 확보 (Sheet 배경색과 동일하게 자연스럽게 이어짐) */}
          <div className="pb-safe">{children}</div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop
        className="fixed inset-0 bg-black/40 backdrop-blur-[1.5px] pointer-events-auto"
        onTap={onClose}
      />
    </Sheet>
  );
};
