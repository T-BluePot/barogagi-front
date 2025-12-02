import HotPlaceSection from "./contents/HotPlaceSection";
import TrendingScheduleSection from "./contents/TrendingScheduleSection";
import UpcomingScheduleSection from "./contents/UpcomingScheduleSection";

type Props = {};

const HomeContentsSection: React.FC<Props> = () => {
  return (
    <div className="flex flex-1 flex-col w-full px-6 items-baseline bg-gray-white overflow-x-hidden">
      <div className="flex flex-col w-full mt-6">
        <HotPlaceSection />
        <UpcomingScheduleSection />
        <TrendingScheduleSection />
      </div>
    </div>
  );
};

export default HomeContentsSection;
