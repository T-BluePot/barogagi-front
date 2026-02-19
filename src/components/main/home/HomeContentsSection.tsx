import HotPlaceSection from "./contents/HotPlaceSection";
import TrendingScheduleSection from "./contents/TrendingScheduleSection";
import UpcomingScheduleSection from "./contents/UpcomingScheduleSection";
import type { ScheduleRegistResDTO } from "@/api/types";

type Props = {
  schedules: ScheduleRegistResDTO[];
  isLoading: boolean;
};

const HomeContentsSection: React.FC<Props> = ({ schedules, isLoading }) => {
  return (
    <div className="flex flex-1 flex-col w-full px-6 items-baseline bg-gray-white overflow-x-hidden">
      <div className="flex flex-col w-full mt-6">
        <HotPlaceSection />
        <UpcomingScheduleSection schedules={schedules} isLoading={isLoading} />
        <TrendingScheduleSection />
      </div>
    </div>
  );
};

export default HomeContentsSection;
