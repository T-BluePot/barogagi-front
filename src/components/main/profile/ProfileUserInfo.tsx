import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import type { ProfileUserInfoProps } from "@/types/profileTypes";

const ProfileUserInfo = ({ nickname, userId }: ProfileUserInfoProps) => {
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent triggering parent click (navigation)
    if (!userId) return;

    window.navigator.clipboard.writeText(userId).then(() => {
      // TODO: Toast message or alert
      alert("아이디가 복사되었습니다.");
    });
  };

  return (
    <div className="flex flex-col items-start">
      <span className="text-title-02 font-bold text-main break-all line-clamp-1">
        {nickname}
      </span>
      {userId && (
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-body text-gray-white truncate max-w-[150px]">
            {userId}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
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
