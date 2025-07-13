import { useEffect } from "react"; // useState 제거
import type { CommonAlertModalLayoutPropsType } from "@/types/modalTypes";

export default function CommonAlertModalLayout({
  isVisible, // 부모로부터 애니메이션 상태를 직접 받음
  buttonInfo,
  onCloseComplete,
  children,
}: CommonAlertModalLayoutPropsType) {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (!isVisible) {
      // isVisible이 false가 되면 사라지는 애니메이션 시작 후 onCloseComplete 호출
      // CSS transition duration과 동일하게 설정
      timer = setTimeout(onCloseComplete, 300);
    }
    return () => clearTimeout(timer); // 클린업
  }, [isVisible, onCloseComplete]); // isVisible 또는 onCloseComplete 변경 시 실행

  // 레이아웃 컴포넌트 자체의 렌더링 여부는 부모 컴포넌트에서 shouldRenderLayout 상태로 제어합니다.
  // 따라서 여기서 null을 반환하는 조건문은 필요 없습니다.
  // 부모가 shouldRenderLayout이 true일 때만 이 컴포넌트를 렌더링합니다.

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
        // 배경 투명도 애니메이션
        isVisible ? "opacity-100" : "opacity-0" // isVisible 상태에 따른 투명도 변경
      }`}
      style={{ background: "rgba(0,0,0,0.4)" }} // 더 투명한 배경
      onClick={buttonInfo.onClick} // 배경 클릭 시 모달 닫기 (이벤트 전파 중지 필요)
    >
      <div
        className={`bg-white rounded-2xl shadow-lg min-w-[280px] max-w-[90vw] max-h-[80vh] text-center transform transition-all duration-300 flex flex-col ${
          // 모달 컨테이너 애니메이션
          isVisible ? "scale-100" : "scale-95" // isVisible 상태에 따른 크기 변경
        }`}
        onClick={(e) => e.stopPropagation()} // 모달 내용 클릭 시 이벤트 전파 중지
      >
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
        <div className="flex justify-center flex-shrink-0">
          <button
            className="px-4 py-2 typo-tag text-black flex-grow-1 rounded-b-2xl rounded-t-none hover:bg-gray-10 transition border-t border-gray-10 "
            onClick={buttonInfo.onClick}
          >
            {buttonInfo.label}
          </button>
        </div>
      </div>
    </div>
  );
}
