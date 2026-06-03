import { useRef } from "react";
import { motion } from "framer-motion";
// === components ===
import { PlanInfo } from "./PlanInfo";
import { TextTag } from "@/components/common/tags/TextTag";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { GradientImage } from "../create/GradientImage";
import fallbackImg from "@/assets/images/category/category_default.jpg";
// === types ===
import type { PlanDetailCardProps } from "@/types/main/plan/planListTypes";
// === api ===
import { API_BASE_URL, ENDPOINTS } from "@/api/endpoints";
// === utils ===
import { openExternal } from "@/utils/openExternal";

const PlanDetailCard = (props: PlanDetailCardProps) => {
  const simple = props.mode === "create";
  const edit = props.mode === "detail";

  const { plan, src, isOpen, onToggleOpen } = props;

  const planName = plan.planNm ?? "";
  const startTime = plan.startTime;
  const endTime = plan.endTime;
  // regionNm 우선, 비면 planAddress로 폴백 (카카오 수정 장소는 regionVOList 미해소로 regionNm이 빔)
  const planPlace = plan.regionNm || plan.planAddress || "";
  const placeAddress = plan.planAddress ?? "";
  const placeInfo = plan.planDescription ?? "";
  const placeLink = plan.planLink ?? "";
  const tagNames = (plan.planTagRegistResDTOList ?? []).map((t) => t.tagNm);
  const planNum = plan.planNum;
  const imageSource = plan.imageLink ?? plan.imageUrl;
  const proxyImageUrl = imageSource
    ? `${API_BASE_URL}${ENDPOINTS.SCHEDULE.IMAGE_PROXY}?url=${encodeURIComponent(imageSource)}`
    : undefined;
  const imageSrc = src ?? proxyImageUrl ?? fallbackImg;

  const moreButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (simple || planNum == null) return;
    props.onOpenCardMenu({
      planNum,
      anchorEl: moreButtonRef.current,
    });
  };

  const handleMapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (placeLink) openExternal(placeLink);
  };

  const planTime = `${startTime} ~ ${endTime}`;

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="flex flex-col items-baseline px-2 py-4 bg-gray-white rounded-xl gap-4 select-none shadow-md overflow-hidden"
      onClick={() => {
        if (!placeLink && !isOpen) return;
        onToggleOpen();
      }}
    >
      <motion.div
        layout="position"
        className="flex w-full justify-between items-baseline"
      >
        <div className="flex flex-col justify-start items-start gap-2 pl-3">
          <span className="typo-subtitle truncate">{planName}</span>
          <PlanInfo timeValue={planTime} locationValue={planPlace} />
          {tagNames.length > 0 && (
            <motion.div
              layout="position"
              className="flex flex-wrap w-full gap-2 mt-2"
            >
              {tagNames.map((tag, idx) => (
                <TextTag key={idx} label={tag} />
              ))}
            </motion.div>
          )}
        </div>
        <div>
          {edit && (
            <button
              ref={moreButtonRef}
              onClick={handleEditClick}
              aria-label="더보기"
              className="rounded-full bg-transparent w-[24px] h-[24px] hover:bg-gray-10 active:bg-gray-10 transition-colors duration-300 ease-in-out"
            >
              <MoreVertIcon className="text-gray-40 text-title-02!" />
            </button>
          )}
        </div>
      </motion.div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, delay: 0.08 }}
          className="flex px-3 w-full"
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
        </motion.div>
      )}
    </motion.div>
  );
};

export default PlanDetailCard;
