import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import type { ProfileUserInfoProps } from "@/types/profileTypes";
import { PROFILE_PAGE_TEXT } from "@/constants/texts/main/profile";
import { useAlertModalStore } from "@/stores/alertModalStore";

/** OAuth 사용자의 경우 "provider=kakao12345" 형태 → "kakao12345"로 정리 */
const stripProvider = (id: string) => id.replace(/^provider=/, "");

const ProfileUserInfo = ({ nickname, userId }: ProfileUserInfoProps) => {
  const { openAlertModal } = useAlertModalStore();
  const displayId = userId ? stripProvider(userId) : "";

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!displayId) return;

    try {
      await window.navigator.clipboard.writeText(displayId);
      openAlertModal({
        title: PROFILE_PAGE_TEXT.COPY_SUCCESS,
        buttonLabel: PROFILE_PAGE_TEXT.ALERT_BUTTON_LABEL,
      });
    } catch {
      openAlertModal({
        title: PROFILE_PAGE_TEXT.COPY_FAIL,
        buttonLabel: PROFILE_PAGE_TEXT.ALERT_BUTTON_LABEL,
      });
    }
  };

  return (
    <div className="flex flex-col items-start">
      <span className="text-title-02 font-bold text-peach-text break-all line-clamp-1">
        {nickname}
      </span>
      {displayId && (
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-body text-gray-50 truncate max-w-[150px]">
            {displayId}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 hover:bg-peach-light rounded-full transition-colors"
            aria-label="아이디 복사"
          >
            <DocumentDuplicateIcon className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileUserInfo;
