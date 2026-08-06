import { useNavigate } from "react-router-dom";

import { useMeQuery } from "@/hooks/queries/useMeQuery";
import { useHasUnreadNotice } from "@/hooks/useHasUnreadNotice";
import { ROUTES } from "@/constants/routes";

interface CommonHeaderProps {
  onClick: () => void; // 아바타 클릭 → 프로필 이동 (MainLayout에서 주입)
}

/**
 * 홈 상단 앱바
 * - 좌: fitpl 워드마크 (italic 800 + 체크 스트로크)
 * - 우: 알림 버튼 + 프로필 아바타 (닉네임 첫 글자, 없으면 기본 표시)
 */
export const CommonHeader = ({ onClick }: CommonHeaderProps) => {
  const navigate = useNavigate();

  // HomePage와 같은 쿼리 키를 사용하므로 캐시를 공유한다 (추가 요청 없음)
  const { user } = useMeQuery();
  const nickName = user?.nickName;

  const hasUnread = useHasUnreadNotice();

  return (
    // 레퍼런스 앱바 리듬: 위 4px / 아래 14px (아래 여백이 인사말과의 간격 역할)
    <header className="flex w-full items-center justify-between bg-white px-5.5 py-3.5 select-none">
      {/* fitpl 워드마크 */}
      <span className="flex items-center text-[23px] font-extrabold italic tracking-[-0.04em] text-peach">
        fitpl
      </span>

      <div className="flex items-center gap-2">
        {/* 알림 버튼 — 안 읽은 공지가 있으면 종 위에 빨간 점 */}
        <button
          type="button"
          aria-label={hasUnread ? "알림, 읽지 않은 알림 있음" : "알림"}
          onClick={() => navigate(ROUTES.MAIN.NOTIFICATION)}
          className="relative flex h-9 w-9 items-center justify-center text-gray-50"
        >
          {hasUnread && (
            // 흰 링으로 종 획과 분리해 작아도 눈에 띄게 한다
            <span className="absolute top-2 right-2 h-1.25 w-1.25 rounded-full bg-alert-red" />
          )}
          <svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 16v-5a6 6 0 10-12 0v5l-2 2h16l-2-2z" />
            <path d="M10 20a2 2 0 004 0" />
          </svg>
        </button>

        {/* 프로필 아바타 (닉네임 첫 글자) */}
        <button
          type="button"
          aria-label="프로필"
          onClick={onClick}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-peach-border bg-peach-light text-[13px] font-semibold text-peach-text"
        >
          {/* 빈 문자열 닉네임도 폴백되도록 ??가 아닌 || 사용 */}
          {nickName?.charAt(0) || "핏"}
        </button>
      </div>
    </header>
  );
};
