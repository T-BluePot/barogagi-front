import { PlanInfo } from "./PlanInfo";
import { TextTag } from "@/components/common/tags/TextTag";

import { GradientImage } from "./GradientImage";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import clsx from "clsx";

interface PlanDetailCardProps {
  /**
   * 일정 상세 카드 컴포넌트 Props
   */
  handleEditPlan: () => void; // 일정 편집 버튼 클릭 핸들러
  planName: string; // 일정명
  startTime: string; // 시작 시간
  endTime: string; // 종료 시간
  planPlace: string; // 장소명
  tags: string[]; // 태그 목록
  /**
   * 카드 상호작용 관련 Props
   */
  isOpen: boolean; // 카드 확장 여부
  setIsOpen: (isOpen: boolean) => void; // 카드 확장 상태 변경 함수
  placeAddress?: string; // 장소 주소
  placeInfo?: string; // 장소 설명
  placeLink?: string; // 장소 링크

  src: string; // 이미지 소스 URL
  alt?: string; // 이미지 대체 텍스트
}

export const PlanDetailCard = ({
  handleEditPlan,
  planName,
  startTime,
  endTime,
  planPlace,
  tags,
  isOpen = false,
  setIsOpen,
  placeAddress,
  placeInfo,
  src,
  alt = "장소 이미지",
  placeLink,
}: PlanDetailCardProps) => {
  const planTime = `${startTime} ~ ${endTime}`;

  const handleCardClick = () => setIsOpen(!isOpen);

  // 편집 버튼 클릭 시 이벤트 전파 차단
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleEditPlan();
  };

  // 지도 영역 클릭 시 이벤트 전파 차단
  const handleMapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(placeLink, "_blank"); // 새 탭에서 장소 링크 열기
  };

  return (
    <div
      className="flex flex-col items-baseline px-5 pt-4 bg-gray-white rounded-xl gap-4 select-none shadow-md"
      onClick={handleCardClick}
    >
      {/* 일정 정보 영역 */}
      <div className="flex flex-col w-full gap-2">
        <div className="flex w-full justify-between items-center">
          <span className="typo-subtitle truncate">{planName}</span>
          <button
            onClick={handleEditClick}
            className="rounded-full bg-transparent p-1 hover:bg-gray-10 active:bg-gray-10 transition-colors duration-300 ease-in-out"
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
        {tags.map((tag, idx) => (
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
        <GradientImage src={src} alt={alt}>
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
