import { useRef } from "react";
import { PlanInfo } from "./PlanInfo";
import { TextTag } from "@/components/common/tags/TextTag";

import type { PlanDetailCardProps } from "@/types/main/plan/scheduleRoutes";

import { GradientImage } from "../create/GradientImage";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import clsx from "clsx";

const PlanDetailCard = (props: PlanDetailCardProps) => {
  // 일정 정보
  const planName = props.plan.planNm;
  const startTime = props.plan.startTime;
  const endTime = props.plan.endTime;

  // 장소 정보
  const planPlace = props.place.regionNm;
  const placeAddress = props.place.address;
  const placeInfo = props.place.placeDescription;
  const placeLink = props.place.planLink;
  const src = props.src;

  // 태그
  const tagNames = props.tags.map((t) => t.tagNm);
  // 컴포넌트 영역
  const isOpen = props.isOpen;
  const onToggleOpen = props.onToggleOpen;

  const onOpenCardMenu = props.onOpenCardMenu;

  // 메뉴 버튼에 ref 연결
  const moreButtonRef = useRef<HTMLButtonElement | null>(null);

  // 메뉴 버튼 클릭 시: 이벤트 전파 막고, ref + planNum 부모로 전달
  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    onOpenCardMenu({
      planNum: props.plan.planNum,
      anchorEl: moreButtonRef.current,
    });
  };

  // 지도 영역 클릭 시 이벤트 전파 차단
  const handleMapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(placeLink, "_blank"); // 새 탭에서 장소 링크 열기
  };

  const planTime = `${startTime} ~ ${endTime}`;

  return (
    <div
      className="flex flex-col items-baseline px-5 pt-4 bg-gray-white rounded-xl gap-4 select-none shadow-md"
      onClick={onToggleOpen}
    >
      {/* 일정 정보 영역 */}
      <div className="flex flex-col w-full gap-2">
        <div className="flex w-full justify-between items-center">
          <span className="typo-subtitle truncate">{planName}</span>
          <button
            ref={moreButtonRef}
            onClick={handleEditClick}
            className="rounded-full bg-transparent w-[24px] h-[24px] hover:bg-gray-10 active:bg-gray-10 transition-colors duration-300 ease-in-out"
          >
            <MoreVertIcon className="text-gray-40 !text-[20px]" />
          </button>
        </div>
        <div>
          <PlanInfo timeValue={planTime} locationValue={planPlace} />
        </div>
      </div>
      {/* 일정 태그 영역 */}
      <div className="flex flex-wrap w-full gap-2">
        {tagNames.map((tag, idx) => (
          <TextTag key={idx} label={tag} />
        ))}
      </div>
      <div
        className={clsx(
          "w-full overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "opacity-100 h-max py-3" : "opacity-0 h-0 py-0"
        )}
        onClick={handleMapClick}
      >
        <GradientImage src={src} alt={planName}>
          <div className="flex flex-wrap flex-col w-full items-baseline gap-1">
            <span className="typo-tag text-gray-20">{placeAddress}</span>
            <span className="typo-tag text-gray-white text-left">
              {placeInfo}
            </span>
          </div>
        </GradientImage>
      </div>
    </div>
  );
};

export default PlanDetailCard;
