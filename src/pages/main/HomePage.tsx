import { useQuery } from "@tanstack/react-query";
import HomeContentsSection from "@/components/main/home/HomeContentsSection";
import HomeGreetingSection from "@/components/main/home/HomeGreetingSection";
import { getMySchedulesSummary } from "@/api/queries";
import { homeKeys } from "@/api/keyFactories";

const HomePage = () => {
  const { data, isLoading } = useQuery({
    queryKey: homeKeys.mySchedules(),
    queryFn: getMySchedulesSummary,
  });

  return (
    <div className="flex flex-col h-full">
      <HomeGreetingSection />
      <HomeContentsSection scheduleData={data ?? null} isLoading={isLoading} />
    </div>
  );
};

export default HomePage;
