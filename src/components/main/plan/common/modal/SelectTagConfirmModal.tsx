import { useState, useEffect, useRef } from "react";
import CommonConfirmModalLayout from "@/components/layout/CommonConfirmModalLayout";
import {
  SelectTagConfirmModalContent,
  type TagOption,
} from "./content/SelectTagConfirmModalContent";

interface SelectTagConfirmModalProps {
  isOpen: boolean;
  tags: TagOption[];
  initialSelectedIds?: string[];
  maxSelection?: number;
  onConfirm: (tags: TagOption[]) => void;
  onCancel: () => void;
}

/**
 * 태그 선택 확인 모달
 * - 사용자가 여러 태그를 선택하고 확인/취소할 수 있는 모달 컴포넌트
 */
export const SelectTagConfirmModal = ({
  isOpen,
  tags,
  initialSelectedIds = [],
  maxSelection,
  onConfirm,
  onCancel,
}: SelectTagConfirmModalProps) => {
  // 모달을 화면에 표시할지 여부 (true면 DOM에 렌더링됨)
  const [shouldRender, setShouldRender] = useState(isOpen);
  // 열림/닫힘 애니메이션 상태 (true면 열리는 애니메이션 재생)
  const [showAnimation, setShowAnimation] = useState(false);
  // 현재 선택된 태그 목록
  const [selectedTags, setSelectedTags] = useState<TagOption[]>([]);

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
      const initial = tags.filter((t) => initialSelectedIds.includes(t.id));
      setSelectedTags(initial);
      // 다음 프레임에서 애니메이션 시작 (부드러운 트랜지션을 위해)
      requestAnimationFrame(() => setShowAnimation(true));
    } else if (!isOpen) {
      // 모달이 닫힐 때는 닫힘 애니메이션만 실행
      setShowAnimation(false);
    }
  }, [isOpen, tags, initialSelectedIds]);

  const handleConfirm = () => {
    onConfirm(selectedTags);
  };

  if (!shouldRender) return null;

  return (
    <CommonConfirmModalLayout
      isVisible={showAnimation}
      confirmButtonInfo={{ label: "확인", onClick: handleConfirm }}
      cancelButtonInfo={{ label: "취소", onClick: onCancel }}
      onCloseComplete={() => setShouldRender(false)}
    >
      <SelectTagConfirmModalContent
        tags={tags}
        initialSelectedIds={initialSelectedIds}
        maxSelection={maxSelection}
        onChangeTags={setSelectedTags}
      />
    </CommonConfirmModalLayout>
  );
};

export default SelectTagConfirmModal;
