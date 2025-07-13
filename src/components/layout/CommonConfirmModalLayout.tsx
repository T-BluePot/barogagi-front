import { useEffect } from "react"; // useState 제거
import type { CommonConfirmModalLayoutPropsType } from "@/types/modalTypes";

export default function CommonConfirmModalLayout({
  isVisible, // 부모로부터 애니메이션 상태를 직접 받음
  confirmButtonInfo,
  cancelButtonInfo,
  onCloseComplete,
  children,
}: CommonConfirmModalLayoutPropsType) {
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
      onClick={cancelButtonInfo.onClick} // 배경 클릭 시 취소 액션 실행
    >
      <div
        className={`bg-white rounded-2xl shadow-lg min-w-[280px] max-w-[90vw] max-h-[80vh] text-center transform transition-all duration-300 flex flex-col ${
          // 모달 컨테이너 애니메이션
          isVisible ? "scale-100" : "scale-95" // isVisible 상태에 따른 크기 변경
        }`}
        onClick={(e) => e.stopPropagation()} // 모달 내용 클릭 시 이벤트 전파 중지
      >
        {/* 모달 내용 영역 */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>

        {/* 버튼 영역 */}
        <div className="flex justify-center border-t border-gray-10 flex-shrink-0">
          {" "}
          {/* 버튼 상단 테두리 */}
          {/* 취소 버튼 */}
          <button
            className="flex-1 px-4 py-3 typo-tag text-gray-70 rounded-bl-2xl hover:bg-gray-10 transition border-r border-gray-10 cursor-pointer"
            onClick={cancelButtonInfo.onClick}
          >
            {cancelButtonInfo.label}
          </button>
          {/* 확인 버튼 */}
          <button
            className="flex-1 px-4 py-3 typo-tag text-blue-600 font-semibold rounded-br-2xl hover:bg-gray-10 transition cursor-pointer"
            onClick={confirmButtonInfo.onClick}
          >
            {confirmButtonInfo.label}
          </button>
        </div>
      </div>
    </div>
  );
}
