import HotPlaceSection from "./contents/HotPlaceSection";

type Props = {};

const HomeContentsSection: React.FC<Props> = () => {
  return (
    <div className="flex flex-1 flex-col w-full px-6 items-baseline bg-gray-white">
      <div className="flex w-full gap-8 mt-6">
        <HotPlaceSection />
      </div>
    </div>
  );
};

export default HomeContentsSection;
