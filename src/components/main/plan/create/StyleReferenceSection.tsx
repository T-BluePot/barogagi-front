import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

import ScheduleStyleSectionLayout from "./ScheduleStyleSectionLayout";
import TextInput from "@/components/common/inputs/TextInput";
import { CommonTag } from "@/components/common/tags/commonTag";

import {
  SCHEDULE_STYLE_TEXT,
  AGE_OPTIONS,
} from "@/constants/texts/main/plan/scheduleStyle";

interface StyleReferenceSectionProps {
  ages: string[];
  onToggleAge: (age: string) => void;
  people: number;
  onChangePeople: (delta: number) => void;
  purpose: string;
  onChangePurpose: (value: string) => void;
  onBlurPurpose?: (e: React.FocusEvent) => void;
  note: string;
  onChangeNote: (value: string) => void;
  onBlurNote?: (e: React.FocusEvent) => void;
}

/**
 * 일정 참고사항 섹션 — 연령대(다중) / 인원수 / 목적 / 추가사항.
 * 입력값은 draft에 저장되고, 생성 시 하나의 comment 문자열로 집계돼 서버로 전송된다.
 */
const StyleReferenceSection = ({
  ages,
  onToggleAge,
  people,
  onChangePeople,
  purpose,
  onChangePurpose,
  onBlurPurpose,
  note,
  onChangeNote,
  onBlurNote,
}: StyleReferenceSectionProps) => {
  return (
    <ScheduleStyleSectionLayout
      title={SCHEDULE_STYLE_TEXT.SEC_TITLE}
      subTitle={SCHEDULE_STYLE_TEXT.SEC_SUB_TITLE}
    >
      <div className="flex w-full flex-col gap-6">
        {/* 연령대 (다중 선택) */}
        <div className="flex flex-col gap-2">
          <p className="typo-subtitle text-gray-black">
            {SCHEDULE_STYLE_TEXT.AGE_LABEL}{" "}
            <span className="typo-caption text-gray-40">
              ({SCHEDULE_STYLE_TEXT.AGE_HINT})
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            {AGE_OPTIONS.map((age) => (
              <CommonTag
                key={age}
                size="small"
                hasHash={false}
                label={age}
                isActive={ages.includes(age)}
                onClick={() => onToggleAge(age)}
              />
            ))}
          </div>
        </div>

        {/* 인원수 (스테퍼) */}
        <div className="flex flex-col gap-2">
          <p className="typo-subtitle text-gray-black">
            {SCHEDULE_STYLE_TEXT.PEOPLE_LABEL}
          </p>
          <div className="flex items-center justify-between bg-gray-5 rounded-xl px-4 py-3">
            <span className="typo-body text-gray-black tabular-nums">
              {people}명
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="인원수 줄이기"
                disabled={people <= 1}
                onClick={() => onChangePeople(-1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-10 text-gray-60 transition-colors active:bg-gray-20 disabled:opacity-40"
              >
                <MinusIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="인원수 늘리기"
                disabled={people >= 10}
                onClick={() => onChangePeople(1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-10 text-gray-60 transition-colors active:bg-gray-20 disabled:opacity-40"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 목적 */}
        <div className="flex flex-col gap-2">
          <p className="typo-subtitle text-gray-black">
            {SCHEDULE_STYLE_TEXT.PURPOSE_LABEL}
          </p>
          <TextInput
            size="small"
            placeholder={SCHEDULE_STYLE_TEXT.PURPOSE_PLACEHOLDER}
            maxLength={30}
            value={purpose}
            onChange={onChangePurpose}
            onBlur={onBlurPurpose}
          />
        </div>

        {/* 추가사항 (자유 입력) */}
        <div className="flex flex-col gap-2">
          <p className="typo-subtitle text-gray-black">
            {SCHEDULE_STYLE_TEXT.NOTE_LABEL}
          </p>
          <TextInput
            size="large"
            placeholder={SCHEDULE_STYLE_TEXT.PLACEHOLDER}
            maxLength={200}
            value={note}
            onChange={onChangeNote}
            onBlur={onBlurNote}
          />
        </div>
      </div>
    </ScheduleStyleSectionLayout>
  );
};

export default StyleReferenceSection;
