import type { ReactNode } from "react";
import LinkIcon from "@mui/icons-material/Link";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import KakaoIcon from "@/assets/icons/kakao-circle.png";
import { BottomModalLayout } from "@/components/common/modal/bottom-modal/BottomModalLayout";
import { BottomModalHeader } from "@/components/common/modal/bottom-modal/BottomModalHeader";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { useScheduleShareLinkQuery } from "@/hooks/queries/useScheduleShareLinkQuery";
import { isKakaoShareConfigured, shareToKakao } from "@/lib/kakao/kakaoShare";
import { SHARE_TEXT } from "@/constants/texts/main/share";
import { useMeQuery } from "@/hooks/queries/useMeQuery";

interface ShareBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleNum: number | undefined;
  /** 카카오 공유 카드 제목 */
  scheduleName: string;
  /**
   * 카카오 공유 카드 썸네일 — 일정에서 사진이 있는 첫 번째 장소의 **원본** 이미지 URL.
   * 카카오 서버가 직접 가져가므로 앱의 이미지 프록시 URL이 아니라 원본을 넘겨야 한다.
   */
  thumbnailUrl?: string;
}

/** Web Share API 미지원 환경(RN WebView, 비보안 컨텍스트 등)에서는 '더보기'를 숨긴다 */
const canWebShare = () =>
  typeof navigator !== "undefined" && typeof navigator.share === "function";

interface ShareActionProps {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

/** 원형 아이콘 + 하단 라벨 형태의 공유 수단 버튼 */
const ShareAction = ({ label, icon, onClick, disabled }: ShareActionProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="ease-fitpl flex w-16 cursor-pointer flex-col items-center gap-2 transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-40"
  >
    {icon}
    <span className="typo-tag text-gray-60">{label}</span>
  </button>
);

/**
 * 일정 공유 바텀시트 — 상세 화면 헤더의 공유 버튼으로 오픈.
 *
 * 링크는 시트가 열릴 때 useScheduleShareLinkQuery 가 발급받는다.
 * 서버가 호출마다 새 토큰을 주므로 훅에서 일정별로 캐싱한다(같은 일정은 세션 내 같은 링크).
 */
const ShareBottomSheet = ({
  isOpen,
  onClose,
  scheduleNum,
  scheduleName,
  thumbnailUrl,
}: ShareBottomSheetProps) => {
  const { openAlertModal } = useAlertModalStore();
  const { shareUrl, isLoading, isError } = useScheduleShareLinkQuery(
    scheduleNum,
    isOpen
  );

  // 공유 카드 문구에 쓸 내 닉네임 — CommonHeader/HomePage와 같은 쿼리 키라 캐시를 공유한다(추가 요청 없음)
  const { user } = useMeQuery();
  const nickName = user?.nickName;

  const alert = (title: string) =>
    openAlertModal({ title, buttonLabel: SHARE_TEXT.ALERT_BUTTON_LABEL });

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await window.navigator.clipboard.writeText(shareUrl);
      alert(SHARE_TEXT.COPY_SUCCESS);
    } catch {
      // 비보안 컨텍스트(http)·구형 브라우저에서는 clipboard API 가 막혀 있다
      alert(SHARE_TEXT.COPY_FAIL);
    }
  };

  const handleKakao = async () => {
    if (!shareUrl) return;
    const ok = await shareToKakao({
      url: shareUrl,
      title: scheduleName,
      description: SHARE_TEXT.KAKAO_CARD_DESCRIPTION(nickName),
      imageUrl: thumbnailUrl,
      buttonTitle: SHARE_TEXT.KAKAO_CARD_BUTTON,
    });
    if (!ok) alert(SHARE_TEXT.KAKAO_FAIL);
  };

  const handleMore = async () => {
    if (!shareUrl) return;
    try {
      await navigator.share({ title: scheduleName, url: shareUrl });
    } catch {
      // 사용자가 공유창을 닫으면 AbortError 가 난다 — 에러로 취급하지 않는다
    }
  };

  const isReady = Boolean(shareUrl) && !isLoading && !isError;
  const hasError = !isLoading && (isError || !shareUrl);

  return (
    <BottomModalLayout isOpen={isOpen} onClose={onClose}>
      <BottomModalHeader variant="title" title={SHARE_TEXT.SHEET_TITLE} />

      {/* BottomModalHeader가 h-16 고정이라 타이틀 아래 여백(기본 20px)이 크게 남는다.
          타이틀-설명 간격을 gap-3(12px)로 맞추기 위해 8px 위로 당긴다. */}
      <div className="-mt-2 flex flex-col gap-5 px-6 pb-6">
        {/* 링크 자체는 노출하지 않는다(랜덤 토큰이라 읽을 가치가 없고 URL 복사 버튼이 그 역할을 함).
            대신 이 문구가 링크 발급 상태(로딩·실패)를 겸한다. */}
        <span
          className={`typo-caption ${hasError ? "text-alert-red" : "text-gray-50"}`}
        >
          {isLoading
            ? SHARE_TEXT.LINK_LOADING
            : hasError
              ? SHARE_TEXT.LINK_ERROR
              : SHARE_TEXT.SHEET_DESCRIPTION}
        </span>

        {/* 공유 수단 — 원형 아이콘 + 라벨 */}
        <div className="flex justify-center gap-8 py-3">
          {isKakaoShareConfigured() && (
            <ShareAction
              label={SHARE_TEXT.KAKAO_BUTTON}
              disabled={!isReady}
              onClick={handleKakao}
              icon={<img src={KakaoIcon} alt="" className="h-12 w-12" />}
            />
          )}

          <ShareAction
            label={SHARE_TEXT.COPY_BUTTON}
            disabled={!isReady}
            onClick={handleCopy}
            icon={
              <span className="bg-gray-10 flex h-12 w-12 items-center justify-center rounded-full">
                <LinkIcon className="text-gray-70" sx={{ fontSize: 24 }} />
              </span>
            }
          />

          {canWebShare() && (
            <ShareAction
              label={SHARE_TEXT.MORE_BUTTON}
              disabled={!isReady}
              onClick={handleMore}
              icon={
                <span className="bg-gray-10 flex h-12 w-12 items-center justify-center rounded-full">
                  <MoreHorizIcon
                    className="text-gray-70"
                    sx={{ fontSize: 24 }}
                  />
                </span>
              }
            />
          )}
        </div>
      </div>
    </BottomModalLayout>
  );
};

export default ShareBottomSheet;
