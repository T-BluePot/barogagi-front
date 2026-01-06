import { useState, useEffect, useRef, useCallback } from "react";
import CommonConfirmModalLayout from "@/components/layout/CommonConfirmModalLayout";
import {
  SelectRegionConfirmModalContent,
  type RegionOption,
} from "./content/SelectRegionConfirmModalContent";

interface SelectRegionConfirmModalProps {
  isOpen: boolean;
  regions: RegionOption[];
  initialSelectedId?: string;
  onConfirm: (region: RegionOption | null) => void;
  onCancel: () => void;
}

/**
 * 지역 선택 확인 모달
 * - 사용자가 지역을 선택하고 확인/취소할 수 있는 모달 컴포넌트
 */
export const SelectRegionConfirmModal = ({
  isOpen,
  regions,
  initialSelectedId,
  onConfirm,
  onCancel,
}: SelectRegionConfirmModalProps) => {
  // 모달을 화면에 표시할지 여부 (true면 DOM에 렌더링됨)
  const [shouldRender, setShouldRender] = useState(isOpen);
  // 열림/닫힘 애니메이션 상태 (true면 열리는 애니메이션 재생)
  const [showAnimation, setShowAnimation] = useState(false);
  // 현재 선택된 지역 정보
  const [selectedRegion, setSelectedRegion] = useState<RegionOption | null>(
    null
  );

  // 이전 isOpen 값을 저장하는 ref
  // ref는 값이 바뀌어도 리렌더링을 유발하지 않아서 이전 상태 추적에 적합
  const prevIsOpenRef = useRef(false);
  // requestAnimationFrame ID를 저장하여 cleanup 시 취소할 수 있게 함
  const rafIdRef = useRef<number | null>(null);

  // 모달 닫힘 애니메이션 완료 후 호출되는 콜백
  // useCallback으로 메모이징하여 매 렌더링마다 새 함수 생성 방지
  const handleCloseComplete = useCallback(() => {
    setShouldRender(false);
  }, []);

  useEffect(() => {
    // 모달이 "방금 열렸는지" 확인 (이전에 닫혀있다가 지금 열린 경우)
    const justOpened = isOpen && !prevIsOpenRef.current;
    // 현재 isOpen 값을 다음 렌더링을 위해 저장
    prevIsOpenRef.current = isOpen;

    if (justOpened) {
      // 모달이 처음 열릴 때만 초기값 설정
      // (모달이 열린 상태에서 props가 바뀌어도 사용자 선택값을 덮어쓰지 않음)
      setShouldRender(true);
      const initial = regions.find((r) => r.id === initialSelectedId) ?? null;
      setSelectedRegion(initial);
      // 다음 프레임에서 애니메이션 시작 (부드러운 트랜지션을 위해)
      rafIdRef.current = requestAnimationFrame(() => setShowAnimation(true));
    } else if (!isOpen) {
      // 모달이 닫힐 때는 닫힘 애니메이션만 실행
      setShowAnimation(false);
    }

    // cleanup: 컴포넌트 언마운트 시 대기 중인 rAF 취소
    return () => {
      if (rafIdRef.current != null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isOpen, regions, initialSelectedId]);

  const handleConfirm = () => {
    onConfirm(selectedRegion);
  };

  if (!shouldRender) return null;

  return (
    <CommonConfirmModalLayout
      isVisible={showAnimation}
      confirmButtonInfo={{ label: "확인", onClick: handleConfirm }}
      cancelButtonInfo={{ label: "취소", onClick: onCancel }}
      onCloseComplete={handleCloseComplete}
    >
      {/* key로 초기값을 포함하여 모달이 다시 열릴 때 Content 컴포넌트를 새로 마운트 */}
      <SelectRegionConfirmModalContent
        key={`${isOpen}-${initialSelectedId ?? "none"}`}
        regions={regions}
        initialSelectedId={initialSelectedId}
        onChangeRegion={setSelectedRegion}
      />
    </CommonConfirmModalLayout>
  );
};

export default SelectRegionConfirmModal;
