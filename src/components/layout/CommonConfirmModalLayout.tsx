import { useEffect } from "react"; // useState 제거
import type { CommonConfirmModalLayoutPropsType } from "@/types/modalTypes";
import { useNativeBack } from "@/utils/nativeBackHandler";

export default function CommonConfirmModalLayout({
  isVisible, // 부모로부터 애니메이션 상태를 직접 받음
  confirmButtonInfo,
  cancelButtonInfo,
  onCloseComplete,
  children,
  contentClassName,
  severity = "default",
}: CommonConfirmModalLayoutPropsType) {
  // 하드웨어 백 버튼: 모달이 보이는 동안 취소 동작으로 가로챔
  // onClick이 정의된 경우에만 활성화 (없으면 다음 단계 — 라우터 뒤로가기 — 로 위임)
  useNativeBack(
    isVisible && !!cancelButtonInfo.onClick,
    cancelButtonInfo.onClick ?? (() => {})
  );

  const isWarning = severity === "warning";
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
      className={`fixed inset-0 flex items-center justify-center z-[200] transition-opacity duration-300 ${
        // 배경 투명도 애니메이션
        isVisible ? "opacity-100" : "opacity-0" // isVisible 상태에 따른 투명도 변경
      } ${
        // warning은 등장 시 오버레이가 단계적으로 짙어지는 keyframe 애니메이션 적용
        isWarning ? "animate-warning-overlay-in" : ""
      }`}
      // default일 때만 inline 배경. warning은 keyframe이 background-color를 제어
      style={isWarning ? undefined : { background: "rgba(0,0,0,0.4)" }}
      onClick={cancelButtonInfo.onClick} // 배경 클릭 시 취소 액션 실행
    >
      <div
        className={`bg-white rounded-2xl shadow-lg min-w-[280px] max-w-[90vw] max-h-[80vh] text-center flex flex-col ${
          isWarning
            ? // warning은 keyframe이 opacity/scale/blur를 함께 제어 (오버레이 진해진 후 등장)
              "animate-warning-modal-in"
            : // default는 기존 scale 트랜지션 유지
              `transform transition-all duration-300 ${
                isVisible ? "scale-100" : "scale-95"
              }`
        }`}
        onClick={(e) => e.stopPropagation()} // 모달 내용 클릭 시 이벤트 전파 중지
      >
        {/* 모달 내용 영역 */}
        <div className={`flex-1 p-4 ${contentClassName ?? "overflow-y-auto"}`}>{children}</div>

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
          {/* 확인 버튼 — variant === "destructive"이면 빨강 강조 */}
          <button
            className={`flex-1 px-4 py-3 typo-tag font-semibold rounded-br-2xl hover:bg-gray-10 transition cursor-pointer ${
              confirmButtonInfo.variant === "destructive"
                ? "text-alert-red"
                : "text-blue-600"
            }`}
            onClick={confirmButtonInfo.onClick}
          >
            {confirmButtonInfo.label}
          </button>
        </div>
      </div>
    </div>
  );
}
