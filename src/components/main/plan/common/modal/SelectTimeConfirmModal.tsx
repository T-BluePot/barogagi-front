import { useState, useEffect } from "react";
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

const DEFAULT_TIME: TimeValue = {
  period: "오전",
  hour: "07",
  minute: "00",
};

export const SelectTimeConfirmModal = ({
  isOpen,
  initialStartTime = DEFAULT_TIME,
  initialEndTime = DEFAULT_TIME,
  onConfirm,
  onCancel,
}: SelectTimeConfirmModalProps) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [showAnimation, setShowAnimation] = useState(false);
  const [startTime, setStartTime] = useState<TimeValue>(initialStartTime);
  const [endTime, setEndTime] = useState<TimeValue>(initialEndTime);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setStartTime(initialStartTime);
      setEndTime(initialEndTime);
      requestAnimationFrame(() => setShowAnimation(true));
    } else {
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
