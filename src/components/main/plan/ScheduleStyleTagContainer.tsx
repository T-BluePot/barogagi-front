import toast from "react-hot-toast";

import { CommonTag } from "@/components/common/tags/commonTag";
import type { TagRegistReqDTO } from "@/api/types";
import type { Dispatch, SetStateAction } from "react";

// id에 따라 활성화 여부 체크
export type ActiveMap = Record<number, boolean>;

export interface ScheduleStyleTagContainerProps {
  styles: TagRegistReqDTO[];
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
    const isActive = !!actives[id];
    const selectedCount = Object.values(actives).filter(Boolean).length;

    // 이미 켜진 것을 끄는 동작은 항상 허용
    if (isActive) {
      setActives((prev) => ({ ...prev, [id]: false }));
      return;
    }

    // 새로 켜려는 경우에만 최대 5개 제한 적용
    if (selectedCount >= 5) {
      toast("태그는 최대 5개까지 선택할 수 있습니다");
    }

    // 정상적으로 켜기
    setActives((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="flex flex-wrap gap-2">
      {styleTags.map((style) => (
        <CommonTag
          key={style.tagNum}
          size="small"
          label={style.tagNm}
          isActive={!!actives[style.tagNum]} // undefined 대비 이중 부정
          onClick={() => toggle(style.tagNum)}
        />
      ))}
    </div>
  );
};
