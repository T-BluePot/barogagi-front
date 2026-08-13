import { useEffect, useState } from "react";

import { BottomModalLayout } from "@/components/common/modal/bottom-modal/BottomModalLayout";
import { BottomModalHeader } from "@/components/common/modal/bottom-modal/BottomModalHeader";
import TextInput from "@/components/common/inputs/TextInput";
import AutoGrowTextarea from "@/components/common/inputs/AutoGrowTextarea";
import CommonButton from "@/components/common/buttons/CommonButton";

interface ScheduleInfoBottomSheetProps {
  isOpen: boolean;
  initialName: string;
  initialMemo: string;
  onClose: () => void;
  onSave: (name: string, memo: string) => void;
}

/**
 * 일정 정보(이름 + 메모) 편집 바텀시트 — detail 헤더의 제목/메모 라인 탭으로 오픈.
 * 저장 시 이름·메모를 한 번에 옵티미스틱 update(서버 scheduleMemo 필드)로 반영한다.
 */
const ScheduleInfoBottomSheet = ({
  isOpen,
  initialName,
  initialMemo,
  onClose,
  onSave,
}: ScheduleInfoBottomSheetProps) => {
  const [name, setName] = useState<string>(initialName);
  const [memo, setMemo] = useState<string>(initialMemo);

  // 시트가 열릴 때마다 현재 값으로 입력 state 동기화
  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setMemo(initialMemo);
    }
  }, [isOpen]);

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return; // 이름이 공백이면 저장하지 않음 (버튼도 비활성)
    onSave(trimmedName, memo);
    onClose();
  };

  return (
    <BottomModalLayout isOpen={isOpen} onClose={onClose}>
      <BottomModalHeader variant="title" title="일정 정보" />
      <div className="flex flex-col gap-4 px-6 pb-6">
        <div className="flex flex-col gap-2">
          <span className="typo-caption text-gray-50">일정 이름</span>
          <TextInput
            size="small"
            placeholder="일정 이름을 입력해 주세요"
            value={name}
            onChange={setName}
            maxLength={30}
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="typo-caption text-gray-50">메모</span>
          <AutoGrowTextarea
            placeholder="이 일정에 대한 메모"
            value={memo}
            onChange={setMemo}
            maxLength={50}
            className="min-h-20 border border-gray-20 rounded-lg p-4 typo-caption text-gray-black placeholder:text-gray-40"
          />
        </div>
        <CommonButton
          label="저장하기"
          onClick={handleSave}
          isDisabled={!name.trim()}
        />
      </div>
    </BottomModalLayout>
  );
};

export default ScheduleInfoBottomSheet;
