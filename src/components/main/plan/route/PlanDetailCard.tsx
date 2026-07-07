import { useRef } from "react";
import { motion } from "framer-motion";
// === components ===
import { PlanInfoItem } from "./PlanInfoItem";
import { TextTag } from "@/components/common/tags/TextTag";
import AutoGrowTextarea from "@/components/common/inputs/AutoGrowTextarea";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckIcon from "@mui/icons-material/Check";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
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

  const {
    plan,
    src,
    isOpen,
    onToggleOpen,
    index,
    kept,
    onToggleKept,
    noteValue,
    onChangeNote,
    onCommitNote,
    reorderMode,
    dragHandle,
  } = props;

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
  // 사용자가 만든 계획(USER_*)은 재생성 시 항상 유지 → 체크 고정 + 비활성
  const isUserKept =
    plan.planSource === "USER_PLACE" || plan.planSource === "USER_CUSTOM";
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

  return (
    <article className="flex gap-3">
      {/* 왼쪽 타임라인 레일: 순번 배지 + 시작~종료 시간 + 점선 연결선 */}
      <div className="flex w-11 shrink-0 flex-col items-center gap-2 pt-1">
        {index != null && (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-main text-white typo-tag">
            {index + 1}
          </span>
        )}
        {startTime && (
          <div className="flex flex-col items-center gap-1">
            <span className="typo-caption text-gray-black tabular-nums">
              {startTime}
            </span>
            {endTime && (
              <>
                <span className="w-2 h-px bg-gray-20" />
                <span className="typo-tag text-gray-40 tabular-nums">
                  {endTime}
                </span>
              </>
            )}
          </div>
        )}
        <div className="w-px flex-1 border-l border-dashed border-gray-20" />
      </div>

      {/* 오른쪽 카드 본문 */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="flex flex-1 min-w-0 flex-col items-baseline px-5 pt-5 pb-4 bg-gray-white rounded-xl gap-4 select-none shadow-md overflow-hidden"
        onClick={() => {
          if (reorderMode) return; // 순서 변경 중엔 확장 토글 비활성
          if (!placeLink && !isOpen) return;
          onToggleOpen();
        }}
      >
        <motion.div
          layout="position"
          className="flex w-full justify-between items-baseline"
        >
          <div className="flex flex-col justify-start items-start gap-2">
            <span className="typo-subtitle truncate">{planName}</span>
            {planPlace && <PlanInfoItem variant="location" value={planPlace} />}
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
          {/* 우상단 영역: detail은 더보기 버튼, create는 "유지" 체크박스 */}
          <div>
            {simple && (
              <button
                type="button"
                role="checkbox"
                aria-checked={isUserKept || (kept ?? false)}
                aria-label={`${planName} 유지하기`}
                disabled={isUserKept}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isUserKept) onToggleKept?.();
                }}
                className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isUserKept || kept
                    ? "bg-main border-main"
                    : "bg-gray-white border-gray-20"
                } ${isUserKept ? "opacity-60" : ""}`}
              >
                <CheckIcon
                  className={`text-[13px]! ${
                    isUserKept || kept ? "text-white" : "text-transparent"
                  }`}
                />
              </button>
            )}
            {edit &&
              (reorderMode ? (
                // 순서 변경 모드: ⋮ 메뉴 대신 드래그 핸들 렌더
                dragHandle
              ) : (
                <button
                  ref={moreButtonRef}
                  onClick={handleEditClick}
                  aria-label="더보기"
                  className="rounded-full bg-transparent w-[24px] h-[24px] hover:bg-gray-10 active:bg-gray-10 transition-colors duration-300 ease-in-out"
                >
                  <MoreVertIcon className="text-gray-40 text-title-02!" />
                </button>
              ))}
          </div>
        </motion.div>

        {/* detail: 인라인 메모 입력 — 수정 모달 메모와 같은 값을 편집, blur 시 커밋 (순서 변경 중엔 숨김) */}
        {edit && !reorderMode && (
          <AutoGrowTextarea
            value={noteValue ?? ""}
            onChange={(v) => onChangeNote?.(v)}
            onBlur={() => onCommitNote?.()}
            onClick={(e) => e.stopPropagation()}
            placeholder="메모를 남겨보세요..."
            ariaLabel={`${planName} 메모`}
            maxLength={50}
            warnOnMaxLength
            className="mt-2 typo-caption rounded-lg border-[1.5px] border-transparent focus:border-gray-40 px-3 py-2 bg-white focus:bg-gray-5 not-placeholder-shown:bg-gray-5 text-gray-black placeholder:text-gray-40 outline-none"
          />
        )}

        {isOpen && !reorderMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.08 }}
            className="w-full"
            onClick={handleMapClick}
          >
            <div className="w-full rounded-2xl overflow-hidden border border-gray-10 cursor-pointer">
              <div className="relative">
                <img
                  src={imageSrc}
                  alt={planName}
                  className="w-full h-36 object-cover"
                  loading="lazy"
                />
                <span className="absolute top-2.5 right-2.5 flex items-center gap-1 typo-tag font-semibold text-gray-80 bg-gray-white/90 backdrop-blur-sm border border-gray-white/60 rounded-full px-2.5 py-1.5 shadow-sm">
                  <MapOutlinedIcon className="text-[14px]!" />
                  지도 보러가기
                </span>
              </div>
              <div className="flex flex-col gap-1.5 p-4 bg-gray-5">
                {placeInfo && (
                  <span className="typo-caption text-gray-70 leading-relaxed">
                    {placeInfo}
                  </span>
                )}
                {(placeAddress || planPlace) && (
                  <span className="flex items-center gap-1 typo-tag text-gray-50 min-w-0">
                    <LocationOnIcon className="text-[14px]! text-main shrink-0" />
                    <span className="truncate">
                      {placeAddress || planPlace}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </article>
  );
};

export default PlanDetailCard;
