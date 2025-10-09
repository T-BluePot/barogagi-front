import HotPlaceSection from "./contents/HotPlaceSection";
import UpcomingScheduleSection from "./contents/UpcomingScheduleSection";

type Props = {};

const HomeContentsSection: React.FC<Props> = () => {
  return (
    <div className="flex flex-1 flex-col w-full px-6 items-baseline bg-gray-white">
      <div className="flex flex-col w-full mt-6">
        <HotPlaceSection />
        <UpcomingScheduleSection />
      </div>
    </div>
  );
};

export default HomeContentsSection;
