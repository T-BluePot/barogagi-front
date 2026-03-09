import { useRef } from "react";
import { PlanInfo } from "./PlanInfo";
import { TextTag } from "@/components/common/tags/TextTag";
import type { PlanDetailCardProps } from "@/types/main/plan/planListTypes";
import { GradientImage } from "../create/GradientImage";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import clsx from "clsx";
import fallbackImg from "@/assets/images/category/category_default.jpg";

const PlanDetailCard = (props: PlanDetailCardProps) => {
  const simple = props.mode === "create";
  const edit = props.mode === "detail";

  const { plan, src, isOpen, onToggleOpen } = props;

  const planName = plan.planNm ?? "";
  const startTime = plan.startTime;
  const endTime = plan.endTime;
  const planPlace = plan.regionNm ?? "";
  const placeAddress = plan.planAddress ?? "";
  const placeInfo = plan.planDescription ?? "";
  const placeLink = plan.planLink ?? "";
  const tagNames = plan.planTagRegistResDTOList.map((t) => t.tagNm);
  const planNum = plan.planNum ?? 0;
  const imageSrc = src ?? fallbackImg;

  const moreButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (simple) return;
    props.onOpenCardMenu({
      planNum,
      anchorEl: moreButtonRef.current,
    });
  };

  const handleMapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (placeLink) window.open(placeLink, "_blank", "noopener,noreferrer");
  };

  const planTime = `${startTime} ~ ${endTime}`;

  return (
    <div
      className="flex flex-col items-baseline px-6 pt-4 bg-gray-white rounded-xl gap-4 select-none shadow-md"
      onClick={onToggleOpen}
    >
      <div className="flex w-full justify-between items-baseline">
        <div className="flex flex-col justify-start items-start gap-2">
          <span className="typo-subtitle truncate">{planName}</span>
          <PlanInfo timeValue={planTime} locationValue={planPlace} />
        </div>
        <div>
          {edit && (
            <button
              ref={moreButtonRef}
              onClick={handleEditClick}
              className="rounded-full bg-transparent w-[24px] h-[24px] hover:bg-gray-10 active:bg-gray-10 transition-colors duration-300 ease-in-out"
            >
              <MoreVertIcon className="text-gray-40 !text-[20px]" />
            </button>
          )}
        </div>
      </div>
      {tagNames.length > 0 && (
        <div className="flex flex-wrap w-full gap-2">
          {tagNames.map((tag, idx) => (
            <TextTag key={idx} label={tag} />
          ))}
        </div>
      )}
      <div
        className={clsx(
          "w-full overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "opacity-100 h-max py-3" : "opacity-0 h-0 py-0"
        )}
        onClick={handleMapClick}
      >
        <GradientImage src={imageSrc} alt={planName}>
          <div className="flex flex-wrap flex-col w-full items-baseline gap-1">
            {placeAddress && (
              <span className="typo-tag text-gray-20">{placeAddress}</span>
            )}
            {placeInfo && (
              <span className="typo-tag text-gray-white text-left">
                {placeInfo}
              </span>
            )}
          </div>
        </GradientImage>
      </div>
    </div>
  );
};

export default PlanDetailCard;
