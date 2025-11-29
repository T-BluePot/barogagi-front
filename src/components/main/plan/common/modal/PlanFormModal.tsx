import { BottomModalLayout } from "@/components/layout/BottomModalLayout";
import { BottomActionHeader } from "@/components/common/bottom-modal/BottomModalHeader";
import {
  CommonInfoItem,
  InputInfoItem,
  TagInfoItem,
} from "@/components/common/bottom-modal/items/InfoListItem";

import type { PlanFormModalProps } from "@/types/main/plan/bottom-modal/planFromTypes";

const PlanFormModal = ({ action, info }: PlanFormModalProps) => {
  // ----- 모달 모드 변수 -----
  const create = info.mode === "Create";
  const edit = info.mode === "Edit";

  const title = info.planNm;
  const time = `${info.startTime} ~ ${info.endTime}`;
  const place = info.address;

  return (
    <BottomModalLayout isOpen={action.isOpen} onClose={action.onClose}>
      <BottomActionHeader
        title={title ?? "내 일정"}
        actionLabel={create ? "제목 작성하기" : "제목 수정하기"}
        onClickAction={action.onClickAction}
      />
      <CommonInfoItem
        placeholder="시간 추가"
        label={time}
        icon={{
          state: time ? "default" : "placeholder",
          type: "key",
          name: "Time",
        }}
        onClick={info.onClickTime}
      />
      <CommonInfoItem
        placeholder="장소 추가"
        label={place}
        icon={{
          state: place ? "default" : "placeholder",
          type: "key",
          name: "Place",
        }}
        onClick={info.onClickAdress}
      />
      {create && <TagInfoItem tags={info.tags} onClick={info.onClickTags} />}
      {edit && (
        <InputInfoItem
          placeholder="이 일정에 대한 메모"
          label={info.note}
          value={info.noteValue}
          onChange={info.onChangeNote}
        />
      )}
    </BottomModalLayout>
  );
};

export default PlanFormModal;
