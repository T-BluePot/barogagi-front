import { useState, useEffect, useRef, useCallback } from "react";
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

  // requestAnimationFrame ID를 저장하는 ref
  // 왜 필요한가? 모달이 빠르게 열렸다 닫히면, 예약된 애니메이션이 나중에 실행되어
  // 이미 닫힌 모달의 상태를 바꿀 수 있음 → cleanup에서 예약 취소하기 위해 ID 저장
  const rafIdRef = useRef<number | null>(null);

  // 모달 닫힘 애니메이션 완료 후 호출되는 콜백
  // 🎯 useCallback을 쓰는 이유:
  // - 이 함수를 useCallback 없이 만들면 매번 새로운 함수가 생성됨
  // - CommonConfirmModalLayout은 onCloseComplete가 바뀔 때마다 "함수가 바뀌었네?"하고 리렌더링
  // - useCallback으로 감싸면 한 번 만든 함수를 계속 재사용 → 불필요한 리렌더링 방지
  const handleCloseComplete = useCallback(() => {
    setShouldRender(false);
  }, []); // 의존성 배열이 비어있어서 컴포넌트 생명주기 동안 함수가 절대 바뀌지 않음

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
      // 🎯 rafIdRef에 ID를 저장하는 이유:
      // requestAnimationFrame은 "다음 프레임에 이 작업 해줘"라고 브라우저에게 예약하는 것
      // 만약 모달이 빠르게 닫히면? 예약된 작업이 나중에 실행돼서 닫힌 모달 상태를 바꿀 수 있음
      // → cleanup에서 cancelAnimationFrame(rafIdRef.current)로 예약 취소
      rafIdRef.current = requestAnimationFrame(() => setShowAnimation(true));
    } else if (!isOpen) {
      // 모달이 닫힐 때는 닫힘 애니메이션만 실행
      setShowAnimation(false);
    }

    // cleanup 함수: useEffect가 다시 실행되거나 컴포넌트가 언마운트될 때 호출됨
    // 🎯 왜 필요한가?
    // 예: 모달 열자마자 바로 닫으면 → requestAnimationFrame은 아직 실행 안됨
    //     근데 cleanup 안하면? → 나중에 예약된 작업이 실행되어 이미 닫힌 모달의 showAnimation을 true로 바꿈
    //     결과: 화면에 안 보이는데 애니메이션 상태만 true인 이상한 상황 발생
    return () => {
      if (rafIdRef.current != null) {
        cancelAnimationFrame(rafIdRef.current); // 예약 취소
        rafIdRef.current = null;
      }
    };
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
      onCloseComplete={handleCloseComplete}
    >
      {/* 🎯 key prop을 추가한 이유:
          React는 key가 바뀌면 "이건 완전히 다른 컴포넌트야!"라고 판단하고 새로 만듦
          
          문제 상황:
          - SelectTimeConfirmModalContent 내부에서 useState(initialStartTime) 같은 패턴 사용
          - 모달 닫았다가 다시 열면? useState는 초기값을 다시 안 읽음 (이미 마운트됐으니까)
          - 결과: 이전에 선택한 시간이 그대로 남아있음
          
          해결 방법:
          - key를 모달 열림 상태 + 초기값으로 구성
          - 모달이 다시 열리면 key가 바뀌어서 컴포넌트를 완전히 새로 만듦
          - 새로 만들어지니까 useState가 초기값을 다시 읽음 → 깨끗한 상태로 시작
      */}
      <SelectTimeConfirmModalContent
        key={`${isOpen}-${initialStartTime.period}-${initialStartTime.hour}-${initialStartTime.minute}-${initialEndTime.period}-${initialEndTime.hour}-${initialEndTime.minute}`}
        initialStartTime={startTime}
        initialEndTime={endTime}
        onChangeTime={handleTimeChange}
      />
    </CommonConfirmModalLayout>
  );
};

export default SelectTimeConfirmModal;
