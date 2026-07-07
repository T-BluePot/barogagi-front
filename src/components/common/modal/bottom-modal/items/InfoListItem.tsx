import { useState } from "react";
import clsx from "clsx";

import { InfoItemContainer } from "./InfoItemContainer";
import { TextTag } from "../../../tags/TextTag";
import AutoGrowTextarea from "@/components/common/inputs/AutoGrowTextarea";

import type { IconType } from "@/types/main/plan/bottom-modal/itemsTypes";
import type { TagRegistResDTO } from "@/api/types";

interface CommonInfoItemProps {
  placeholder: string;
  label?: string;
  icon: IconType;
  disabled?: boolean;
  onClick?: () => void;
}

export const CommonInfoItem = ({
  placeholder,
  label,
  icon,
  disabled = false,
  onClick,
}: CommonInfoItemProps) => {
  const isEmpty = !label || label.trim().length === 0;
  const textClass = clsx(
    "flex typo-body text-left break-keep",
    isEmpty ? "text-gray-40" : "text-gray-80"
  );

  return (
    <InfoItemContainer disabled={disabled} onClick={onClick} icon={icon}>
      <div className={textClass}>{label ? label : placeholder}</div>
    </InfoItemContainer>
  );
};

interface InputInfoItemProps {
  placeholder: string;
  label?: string;

  value?: string; // input에 바인딩할 값
  onChange?: (next: string) => void; // input 값 변경 핸들러
}

export const InputInfoItem = ({
  placeholder,
  label,
  value,
  onChange,
}: InputInfoItemProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const isEmpty = !label || label.trim().length === 0;

  const textClass = clsx(
    "flex w-full typo-body text-left whitespace-pre-wrap break-words",
    isEmpty ? "text-gray-40" : "text-gray-80"
  );

  // 리스트 모드에서 클릭 → 입력 모드 진입
  const handleEnterEdit = () => {
    setIsEditing(true);
  };

  // 입력 종료 (blur). 실제 메모 저장은 모달 닫힘 시점에 일괄 처리됨
  const handleExitEdit = () => {
    setIsEditing(false);
  };

  return (
    <InfoItemContainer
      icon={{
        state: isEmpty && !isEditing ? "placeholder" : "default",
        type: "key",
        name: "Note",
      }}
      onClick={handleEnterEdit}
    >
      {!isEditing ? (
        <div className={textClass}>{!isEmpty ? label : placeholder}</div>
      ) : (
        <AutoGrowTextarea
          className="typo-body text-gray-80 text-left bg-transparent outline-none"
          value={value ?? ""}
          onChange={(v) => onChange?.(v)}
          maxLength={50}
          onBlur={handleExitEdit}
          autoFocus
        />
      )}
    </InfoItemContainer>
  );
};

interface TagInfoItemProps {
  tags?: TagRegistResDTO[];
  onClick?: () => void;
}

export const TagInfoItem = ({ tags, onClick }: TagInfoItemProps) => {
  const isEmpty = !tags || tags.length === 0;

  return (
    <InfoItemContainer
      icon={{
        state: isEmpty ? "placeholder" : "default",
        type: "key",
        name: "Tag",
      }}
      onClick={onClick}
    >
      <div
        className={clsx(
          "flex flex-wrap gap-1 typo-body text-left break-keep",
          isEmpty ? "text-gray-40" : "text-gray-80"
        )}
      >
        {isEmpty
          ? "이 일정에 대한 태그 (선택)"
          : tags.map((tag) => (
              <div key={tag.tagNum} className="pr-1">
                <TextTag size="large" label={tag.tagNm} />
              </div>
            ))}
      </div>
    </InfoItemContainer>
  );
};
