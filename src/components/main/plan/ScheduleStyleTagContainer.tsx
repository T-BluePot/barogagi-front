import { CommonTag } from "@/components/common/tags/commonTag";
import type { ScheduleStyle } from "@/types/main/plan/scheduleStyles";
import type { Dispatch, SetStateAction } from "react";

// id에 따라 활성화 여부 체크
export type ActiveMap = Record<number, boolean>;

export interface ScheduleStyleTagContainerProps {
  styles: ScheduleStyle[];
  actives: ActiveMap;
  setActives: Dispatch<SetStateAction<ActiveMap>>;
}

export const ScheduleStyleTagContainer = ({
  styles,
  actives,
  setActives,
}: ScheduleStyleTagContainerProps) => {
  // 일정 태그는 최대 10개까지 출력
  const styleTags = styles.slice(0, 10);

  const toggle = (id: number) => {
    setActives((prev) => {
      const isActive = !!prev[id]; // 현재 id가 활성인지
      const selectedCount = Object.values(prev).filter(Boolean).length;

      // 이미 켜진 것을 끄는 동작은 항상 허용
      if (isActive) {
        return { ...prev, [id]: false };
      }

      // 새로 켜려는 경우에만 최대 5개 제한 적용
      if (selectedCount >= 5) {
        alert("태그는 최대 5개까지 선택할 수 있습니다.");
        return prev; // 변경 없이 그대로 반환
      }

      // 정상적으로 켜기
      return { ...prev, [id]: true };
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {styleTags.map((style) => (
        <CommonTag
          key={style.id}
          size="small"
          label={style.name}
          isActive={!!actives[style.id]} // undefined 대비 이중 부정
          onClick={() => toggle(style.id)}
        />
      ))}
    </div>
  );
};
