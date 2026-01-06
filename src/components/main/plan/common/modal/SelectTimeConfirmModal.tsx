import { useState, useEffect, useRef } from "react";
import CommonConfirmModalLayout from "@/components/layout/CommonConfirmModalLayout";
import {
  SelectTimeConfirmModalContent,
  type TimeValue,
} from "./content/SelectTimeConfirmModalContent";

interface SelectTimeConfirmModalProps {
  isOpen: boolean;
  initialStartTime?: TimeValue;
  initialEndTime?: TimeValue;
  onConfirm: (startTime: TimeValue, endTime: TimeValue) => void;
  onCancel: () => void;
}

// props로 시간이 전달되지 않았을 때 사용할 기본값
const DEFAULT_TIME: TimeValue = {
  period: "오전",
  hour: "07",
  minute: "00",
};

/**
 * 시간 선택 확인 모달
 * - 사용자가 시작/종료 시간을 선택하고 확인/취소할 수 있는 모달 컴포넌트
 */
export const SelectTimeConfirmModal = ({
  isOpen,
  initialStartTime = DEFAULT_TIME,
  initialEndTime = DEFAULT_TIME,
  onConfirm,
  onCancel,
}: SelectTimeConfirmModalProps) => {
  // 모달을 화면에 표시할지 여부 (true면 DOM에 렌더링됨)
  const [shouldRender, setShouldRender] = useState(isOpen);
  // 열림/닫힘 애니메이션 상태 (true면 열리는 애니메이션 재생)
  const [showAnimation, setShowAnimation] = useState(false);
  // 현재 선택된 시작 시간
  const [startTime, setStartTime] = useState<TimeValue>(initialStartTime);
  // 현재 선택된 종료 시간
  const [endTime, setEndTime] = useState<TimeValue>(initialEndTime);

  // 이전 isOpen 값을 저장하는 ref
  // ref는 값이 바뀌어도 리렌더링을 유발하지 않아서 이전 상태 추적에 적합
  const prevIsOpenRef = useRef(false);

  useEffect(() => {
    // 모달이 "방금 열렸는지" 확인 (이전에 닫혀있다가 지금 열린 경우)
    const justOpened = isOpen && !prevIsOpenRef.current;
    // 현재 isOpen 값을 다음 렌더링을 위해 저장
    prevIsOpenRef.current = isOpen;

    if (justOpened) {
      // 모달이 처음 열릴 때만 초기값 설정
      // (모달이 열린 상태에서 props가 바뀌어도 사용자 선택값을 덮어쓰지 않음)
      setShouldRender(true);
      setStartTime(initialStartTime);
      setEndTime(initialEndTime);
      // 다음 프레임에서 애니메이션 시작 (부드러운 트랜지션을 위해)
      requestAnimationFrame(() => setShowAnimation(true));
    } else if (!isOpen) {
      // 모달이 닫힐 때는 닫힘 애니메이션만 실행
      setShowAnimation(false);
    }
  }, [isOpen, initialStartTime, initialEndTime]);

  const handleTimeChange = (newStartTime: TimeValue, newEndTime: TimeValue) => {
    setStartTime(newStartTime);
    setEndTime(newEndTime);
  };

  const handleConfirm = () => {
    onConfirm(startTime, endTime);
  };

  if (!shouldRender) return null;

  return (
    <CommonConfirmModalLayout
      isVisible={showAnimation}
      confirmButtonInfo={{ label: "확인", onClick: handleConfirm }}
      cancelButtonInfo={{ label: "취소", onClick: onCancel }}
      onCloseComplete={() => setShouldRender(false)}
    >
      <SelectTimeConfirmModalContent
        initialStartTime={startTime}
        initialEndTime={endTime}
        onChangeTime={handleTimeChange}
      />
    </CommonConfirmModalLayout>
  );
};

export default SelectTimeConfirmModal;
