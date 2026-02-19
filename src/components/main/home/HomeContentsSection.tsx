import HotPlaceSection from "./contents/HotPlaceSection";
import TrendingScheduleSection from "./contents/TrendingScheduleSection";
import UpcomingScheduleSection from "./contents/UpcomingScheduleSection";
import type { HomeScheduleResponseDTO } from "@/api/types";

type Props = {
  scheduleData: HomeScheduleResponseDTO | null;
  isLoading: boolean;
};

const HomeContentsSection: React.FC<Props> = ({ scheduleData, isLoading }) => {
  return (
    <div className="flex flex-1 flex-col w-full px-6 items-baseline bg-gray-white overflow-x-hidden">
      <div className="flex flex-col w-full mt-6">
        <HotPlaceSection />
        <UpcomingScheduleSection scheduleData={scheduleData} isLoading={isLoading} />
        <TrendingScheduleSection />
      </div>
    </div>
  );
};

export default HomeContentsSection;
