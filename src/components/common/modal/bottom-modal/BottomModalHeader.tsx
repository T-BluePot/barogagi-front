import type {
  BottomModalHeaderProps,
  TitleWithActionHeaderProps,
} from "@/types/BottomModalTypes";

export const BottomModalHeader = ({
  variant,
  title,
  onCancel,
  onConfirm,
}: BottomModalHeaderProps) => {
  return (
    <div className="flex h-16 items-center justify-between px-6">
      {variant !== "title" && (
        <button
          onClick={onCancel}
          className="typo-subtitle text-gray-60 cursor-pointer"
        >
          취소
        </button>
      )}
      <span className="typo-title-02 text-gray-black">{title}</span>
      {variant !== "title" && (
        <button
          onClick={onConfirm}
          className="typo-subtitle text-gray-black cursor-pointer"
        >
          확인
        </button>
      )}
    </div>
  );
};

export const BottomActionHeader = ({
  title,
  titlePlaceholder = false,
  actionLabel,
  onClickAction,
  onClickTitle,
}: TitleWithActionHeaderProps) => {
  const titleClassName = titlePlaceholder
    ? "text-title-02 font-normal text-gray-30" // 이름 미입력: 회색 + 얇게
    : "typo-title-02 text-gray-black";

  // 제목 편집이 가능한 모달에서는 **헤더 줄 전체**가 하나의 버튼이다.
  // 제목과 '제목 수정하기'를 각각 버튼으로 쪼개면 둘 사이 여백이 죽은 영역이 되고,
  // 스크린리더에도 같은 동작이 두 번 읽힌다. 하나로 묶어 히트 영역을 줄 전체로 넓힌다.
  if (onClickTitle) {
    return (
      <button
        type="button"
        onClick={onClickTitle}
        aria-label={actionLabel ? `${title} · ${actionLabel}` : title}
        className="flex h-16 w-full cursor-pointer items-center justify-between px-6 text-left"
      >
        <span className={`${titleClassName} min-w-0 truncate`}>{title}</span>
        {actionLabel && (
          // 버튼 안이라 span 이다. 여기서 button 을 중첩하면 유효하지 않은 마크업이 된다.
          <span className="typo-caption text-gray-60 shrink-0">
            {actionLabel}
          </span>
        )}
      </button>
    );
  }

  // 제목 편집이 아닌 액션(예: SelectRegionBottomModal 의 '지역 변경')은 기존대로
  // 우측 버튼만 눌리게 둔다. 줄 전체를 눌러 초기화되면 안 되기 때문이다.
  return (
    <div className="flex h-16 items-center justify-between px-6">
      <span className={`${titleClassName} min-w-0 truncate`}>{title}</span>
      {actionLabel && (
        <button
          type="button"
          onClick={onClickAction}
          className="typo-caption text-gray-60 shrink-0 cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
