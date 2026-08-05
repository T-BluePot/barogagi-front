import { useState } from "react";
import { format, parseISO, isValid } from "date-fns";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import Chip from "@/components/common/Chip";
import SkeletonBlock from "@/components/common/loading/SkeletonBlock";
import {
  NOTIFICATION_TABS,
  NOTIFICATION_TEXT,
} from "@/constants/texts/main/notification";
import { useBoardListQuery } from "@/hooks/queries/useBoardListQuery";
import { useBoardDetailQuery } from "@/hooks/queries/useBoardDetailQuery";
import { useReadNotificationStore } from "@/stores/readNotificationStore";
import type { BoardListItemDTO } from "@/api/types";

/** globals.css 의 `--ease-fitpl` 와 같은 값 (framer-motion 은 CSS 변수를 못 읽는다) */
const EASE_FITPL = [0.2, 0, 0, 1] as const;

/** 좌우 여백은 페이지가 아니라 각 항목이 갖는다 — 구분선이 화면 끝까지 이어지도록 */
const ROW_PADDING = "px-6";

/** "2026-05-30T23:07:42" → "2026.05.30". 형식이 어긋나면 표기를 생략한다(더미값 금지) */
const formatNoticeDate = (iso: string): string | undefined => {
  const parsed = parseISO(iso);
  return isValid(parsed) ? format(parsed, "yyyy.MM.dd") : undefined;
};

/**
 * 비었거나 실패했을 때의 안내 — 목록 자리에 가운데 정렬로 세운다.
 * 일정 탭(`ScheduleList`)의 빈 상태와 같은 방식이다.
 */
const CenteredNotice = ({ message }: { message: string }) => (
  <div
    className="flex flex-1 items-center justify-center px-6 pb-16"
    role="status"
  >
    <p className="typo-body whitespace-pre-line text-center text-gray-50">
      {message}
    </p>
  </div>
);

/** 펼쳐졌을 때만 본문을 받아온다 */
const NoticeBody = ({ boardNum }: { boardNum: number }) => {
  const { notice, isLoading, isError } = useBoardDetailQuery(boardNum);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1.5">
        <SkeletonBlock width="w-full" height="h-3" rounded="rounded" />
        <SkeletonBlock width="w-4/5" height="h-3" rounded="rounded" />
      </div>
    );
  }
  if (isError || !notice) {
    return (
      <p className="typo-description text-gray-40">
        {NOTIFICATION_TEXT.DETAIL_ERROR}
      </p>
    );
  }

  return (
    <p className="typo-description whitespace-pre-line text-gray-60">
      {notice.boardContent}
    </p>
  );
};

const NoticeItem = ({ notice }: { notice: BoardListItemDTO }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isRead = useReadNotificationStore((s) => s.readIds).includes(
    notice.boardNum
  );
  const markAsRead = useReadNotificationStore((s) => s.markAsRead);

  const dateLabel = formatNoticeDate(notice.regDate);

  const handleToggle = () => {
    // 펼치는 순간 읽음 처리한다. 접을 때는 되돌리지 않는다
    if (!isOpen) markAsRead(notice.boardNum);
    setIsOpen((prev) => !prev);
  };

  return (
    <li className="border-b border-gray-10">
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        className={clsx("flex w-full items-start gap-2 py-4 text-left", ROW_PADDING)}
      >
        {/* [중요]
              제목
              날짜        ← 칩은 자체 줄. 칩 ~ 아래 묶음은 gap-2 */}
        <span className="flex min-w-0 flex-1 flex-col items-start gap-2">
          {notice.isImportant === "Y" && (
            <Chip
              label={NOTIFICATION_TEXT.IMPORTANT_BADGE}
              tone="solid"
              size="sm"
            />
          )}

          {/* 제목·날짜 묶음만 살짝 들여쓴다(px-1). 칩은 행 여백에 그대로 붙는다 */}
          <span className="flex w-full min-w-0 flex-col gap-3 px-1">
            <span className="relative min-w-0">
              {/* 안 읽은 점은 좌여백(24px) 안쪽에 띄운다 —
                  흐름에 넣으면 그만큼 본문이 밀려 좌우 여백이 달라 보인다 */}
              {!isRead && (
                <span
                  className="absolute top-1/2 -left-3.5 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-main"
                  role="img"
                  aria-label={NOTIFICATION_TEXT.UNREAD_LABEL}
                />
              )}
              {/* 제목은 읽음 여부와 무관하게 가장 진한 색을 쓴다.
                  구분은 왼쪽 점이 담당한다(색을 흐리면 목록 전체가 탁해진다) */}
              <span className="typo-body block truncate text-gray-black">
                {notice.boardTitle}
              </span>
            </span>
            {dateLabel && (
              <span className="typo-tag text-gray-40">{dateLabel}</span>
            )}
          </span>
        </span>

        <KeyboardArrowUpIcon
          className={clsx(
            "shrink-0 text-gray-40 transition-transform duration-300",
            isOpen ? "rotate-180" : "rotate-0"
          )}
        />
      </button>

      {/* 펼침 — 높이를 애니메이션한다. 접히면 DOM 에서 빠져 본문 요청도 나가지 않는다 */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE_FITPL }}
            className="overflow-hidden"
          >
            <div className={clsx("pb-4", ROW_PADDING)}>
              <NoticeBody boardNum={notice.boardNum} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

/**
 * 알림 화면 (임시)
 *
 * 서버에 "받은 알림 내역" API 가 없어서 **공지사항(`/board`)만** 노출한다.
 * 읽음 상태도 서버에 없어 기기 로컬에 저장한다(`readNotificationStore`).
 *
 * 분류 탭(`NOTIFICATION_TABS`)은 지금 항목이 하나뿐이라 렌더하지 않는다.
 * 다가오는 일정 알림 등 공지가 아닌 종류가 생기면 상수에 추가하는 것만으로 나타난다.
 *
 * ⚠️ 페이지에는 좌우 여백을 주지 않는다 — 항목마다 `ROW_PADDING` 을 갖고,
 *    구분선은 화면 끝까지 이어져야 목록이 끊겨 보이지 않는다.
 */
const NotificationPage = () => {
  const { notices, isLoading, isError } = useBoardListQuery();
  const [activeTab, setActiveTab] = useState(NOTIFICATION_TABS[0].key);

  const renderContent = () => {
    if (isLoading) {
      return (
        <ul className={clsx("flex flex-col gap-3 pt-4", ROW_PADDING)}>
          {[0, 1, 2].map((i) => (
            <li key={i}>
              <SkeletonBlock width="w-full" height="h-14" rounded="rounded-lg" />
            </li>
          ))}
        </ul>
      );
    }
    // 화면 전체가 목록인 페이지라, 홈 섹션용 회색 박스(EmptyContent) 대신
    // 일정 탭과 같은 "가운데 텍스트" 방식을 쓴다
    if (isError) {
      return <CenteredNotice message={NOTIFICATION_TEXT.ERROR} />;
    }
    if (notices.length === 0) {
      return <CenteredNotice message={NOTIFICATION_TEXT.EMPTY} />;
    }
    return (
      <ul className="flex flex-col">
        {notices.map((notice) => (
          <NoticeItem key={notice.boardNum} notice={notice} />
        ))}
      </ul>
    );
  };

  return (
    <div className="flex h-full w-full flex-col">
      {/* 분류 칩 — 종류가 둘 이상일 때만 노출된다 */}
      {NOTIFICATION_TABS.length > 1 && (
        <div
          className={clsx(
            "hide-scrollbar flex gap-2 overflow-x-auto py-3",
            ROW_PADDING
          )}
        >
          {NOTIFICATION_TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              aria-pressed={activeTab === key}
              className={clsx(
                "typo-tag shrink-0 rounded-full px-3 py-1.5 transition-colors",
                activeTab === key
                  ? "bg-peach-light font-semibold text-peach-text"
                  : "bg-gray-10 text-gray-50"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {renderContent()}
    </div>
  );
};

export default NotificationPage;
