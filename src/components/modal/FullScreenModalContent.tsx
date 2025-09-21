import CommonButton from "@/components/common/buttons/CommonButton";

type FullScreenModalContentProps = {
  title?: string;
  content?: string;
  buttonLabel?: string;
  highlightText?: string; // 강조할 텍스트 (녹색으로 표시)
  onButtonClick: () => void;
};

const FullScreenModalContent = ({
  title,
  content,
  buttonLabel = "확인",
  highlightText,
  onButtonClick,
}: FullScreenModalContentProps) => {
  // 기본값 설정: title이나 content 중 하나라도 있어야 함
  const displayTitle = title || "알림";
  const displayContent = content || "";
  const hasContent = title || content || highlightText;

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6">
      {/* 텍스트 영역 */}
      <div className="flex flex-1 justify-center flex-col items-center text-center mb-16 ">
        {/* 제목은 항상 표시 (기본값 포함) */}
        <div className="pb-3">
          <h1 className="typo-title-01 text-white mb-6 whitespace-pre-line">
            {displayTitle}
          </h1>

          {/* 강조 텍스트 (아이디) */}
          {highlightText && (
            <div className="mb-4">
              <span className="typo-title-01 text-main">{highlightText}</span>
            </div>
          )}
        </div>

        {/* 내용이 있을 때만 표시 */}
        {displayContent && (
          <p className="typo-body text-gray-30 mb-8 whitespace-pre-line leading-relaxed">
            {displayContent}
          </p>
        )}

        {/* 아무 내용도 없을 때 기본 메시지 */}
        {!hasContent && (
          <p className="typo-body text-gray-30 mb-8">
            내용을 불러오는 중입니다...
          </p>
        )}
      </div>

      {/* 버튼 영역 */}
      <div className="w-full max-w-sm">
        <CommonButton
          label={buttonLabel}
          onClick={onButtonClick}
          isDisabled={false}
        />
      </div>
    </div>
  );
};

export default FullScreenModalContent;
