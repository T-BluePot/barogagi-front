import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getMe } from "@/api/queries/authQueries";
import { authKeys } from "@/api/keyFactories";
import { ROUTES } from "@/constants/routes";
import type { BaseResponse } from "@/api/types";
import type { UserData } from "@/types/profileTypes";

interface CommonHeaderProps {
  onClick: () => void; // 아바타 클릭 → 프로필 이동 (Layout에서 주입)
}

/**
 * 홈 상단 앱바
 * - 좌: fitpl 워드마크 (italic 800 + 체크 스트로크)
 * - 우: 알림 버튼 + 프로필 아바타 (닉네임 첫 글자, 없으면 기본 표시)
 */
export const CommonHeader = ({ onClick }: CommonHeaderProps) => {
  const navigate = useNavigate();

  // HomePage와 같은 쿼리 키를 사용하므로 캐시를 공유한다 (추가 요청 없음)
  const { data: userResponse } = useQuery({
    queryKey: authKeys.me(),
    queryFn: getMe,
    retry: false,
  });
  const nickName = (userResponse as unknown as BaseResponse<UserData>)?.data
    ?.nickName;

  return (
    <header className="flex h-14 w-full items-center justify-between bg-white px-6 select-none">
      {/* fitpl 워드마크 */}
      <span className="flex items-center text-[23px] font-extrabold italic tracking-[-0.04em] text-peach">
        fitpl
        <svg
          width={15}
          height={15}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ml-px"
        >
          <path d="M4 12l5 5L20 6" />
        </svg>
      </span>

      <div className="flex items-center gap-2">
        {/* 알림 버튼 */}
        <button
          type="button"
          aria-label="알림"
          onClick={() => navigate(ROUTES.MAIN.NOTIFICATION)}
          className="flex h-9 w-9 items-center justify-center text-gray-50"
        >
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
          {nickName?.charAt(0) ?? "핏"}
        </button>
      </div>
    </header>
  );
};
