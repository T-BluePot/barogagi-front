import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { EASE_FITPL } from "@/constants/motion";

import { MAGIC_SCHEDULE_TEXT } from "@/constants/texts/main/plan/magicSchedule";

import type { MagicTimeBand } from "@/types/api/scheduleTypes";
import { buildMagicSlotPreview } from "@/utils/main/plan/magicTimeBands";

interface MagicSlotPreviewProps {
  bands: MagicTimeBand[];
}

/**
 * 생성 결과 미리보기 — 고른 시간대가 몇 칸으로 쪼개지는지, 어디가 식사로 고정되는지.
 *
 * 기본은 접어 둔다. 확인 화면의 주인공은 날짜·지역·시간이고 이건 부연이라
 * 섹션 제목을 주면 위계가 뒤집힌다. 궁금한 사람만 펼쳐 보면 된다.
 */
const MagicSlotPreview = ({ bands }: MagicSlotPreviewProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const slots = buildMagicSlotPreview(bands);
  if (slots.length === 0) return null;

  return (
    <div className="border-t border-gray-10">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-2 py-3.5"
      >
        <span className="typo-caption text-gray-70">
          {MAGIC_SCHEDULE_TEXT.PREVIEW.TITLE}
        </span>
        <motion.span
          className="ml-auto flex text-gray-40"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: EASE_FITPL }}
        >
          <ChevronDownIcon className="h-4 w-4" aria-hidden />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE_FITPL }}
          >
            <ul className="flex flex-col pb-3">
              {slots.map((slot, index) => (
                // 세로선이 행 사이에서 끊기지 않도록 grid 로 짠다.
                // li 에 py 를 주면 그 패딩만큼 축 셀이 짧아져 선이 토막난다
                // → 위아래 여백은 양옆 셀이 갖고, 가운데 축 셀은 행 높이를 꽉 채운다.
                <li
                  key={slot.startTime}
                  className="grid grid-cols-[44px_8px_1fr] gap-x-3"
                  aria-label={`${slot.startTime}부터 ${slot.endTime}까지 ${
                    slot.isMeal
                      ? MAGIC_SCHEDULE_TEXT.PREVIEW.MEAL
                      : MAGIC_SCHEDULE_TEXT.PREVIEW.RANDOM
                  }`}
                >
                  <span className="py-1.5 typo-description text-gray-50">
                    {slot.startTime}
                  </span>

                  {/* 타임라인 축 — 점 + 위아래로 이어지는 선 */}
                  <span className="relative flex justify-center">
                    {index > 0 && (
                      <span className="absolute top-0 bottom-1/2 w-px bg-gray-20" />
                    )}
                    {index < slots.length - 1 && (
                      <span className="absolute top-1/2 bottom-0 w-px bg-gray-20" />
                    )}
                    <span
                      className={`relative my-auto h-2 w-2 rounded-full ${
                        slot.isMeal ? "bg-peach" : "bg-gray-20"
                      }`}
                    />
                  </span>

                  <span
                    className={`py-1.5 typo-caption ${
                      slot.isMeal ? "text-gray-90" : "text-gray-50"
                    }`}
                  >
                    {slot.isMeal
                      ? MAGIC_SCHEDULE_TEXT.PREVIEW.MEAL
                      : MAGIC_SCHEDULE_TEXT.PREVIEW.RANDOM}
                  </span>
                </li>
              ))}
            </ul>

            <p className="pb-3 typo-description text-gray-40">
              {MAGIC_SCHEDULE_TEXT.PREVIEW.CAPTION}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MagicSlotPreview;
