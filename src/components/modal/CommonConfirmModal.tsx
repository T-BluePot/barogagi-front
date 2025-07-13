import { useEffect, useState } from "react";
import CommonConfirmModalLayout from "../layout/CommonConfirmModalLayout";
import CommonModalContent from "./CommonModalContent";
import type { CommonConfirmModalPropsType } from "@/types/modalTypes";

const CommonConfirmModal = ({
  isOpen,
  confirmButtonInfo,
  cancelButtonInfo,
  modalContent,
}: CommonConfirmModalPropsType) => {
  // shouldRenderLayout: 모달 레이아웃 컴포넌트 자체를 DOM에 렌더링할지 여부 (사라지는 애니메이션 후 제거)
  const [shouldRenderLayout, setShouldRenderLayout] = useState(isOpen);
  // showAnimation: 나타나고 사라지는 애니메이션 상태 제어 (Layout 컴포넌트에 전달하는 isVisible prop)
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // 모달을 열어야 할 때:
      // 1. 레이아웃 렌더링 시작 (DOM에 추가)
      setShouldRenderLayout(true);
      // 2. DOM에 추가된 후 다음 렌더링 사이클에서 애니메이션 시작 상태로 변경
      // requestAnimationFrame 또는 setTimeout(0) 사용
      requestAnimationFrame(() => {
        setShowAnimation(true);
      });
    } else {
      // 모달을 닫아야 할 때:
      // 사라지는 애니메이션 시작 (Layout 컴포넌트의 isVisible이 false가 됨)
      setShowAnimation(false);
      // Layout 컴포넌트의 onCloseComplete가 호출되면 shouldRenderLayout(false) 설정
      // (이 부분은 Layout 컴포넌트에서 setTimeout 후 호출)
    }
  }, [isOpen]); // isOpen prop이 변경될 때마다 이펙트 실행

  // 완전히 렌더링할 필요가 없으면 null 반환
  // shouldRenderLayout이 false일 때만 null 반환
  if (!shouldRenderLayout) {
    return null;
  }

  // CommonConfirmModalLayout에 필요한 props 전달
  return (
    <CommonConfirmModalLayout
      isVisible={showAnimation} // Layout의 애니메이션 상태 제어
      confirmButtonInfo={confirmButtonInfo}
      cancelButtonInfo={cancelButtonInfo}
      onCloseComplete={() => setShouldRenderLayout(false)} // Layout의 애니메이션 완료 후 레이아웃 제거
    >
      <CommonModalContent
        title={modalContent.title}
        content={modalContent.content}
      />
    </CommonConfirmModalLayout>
  );
};

export default CommonConfirmModal;
