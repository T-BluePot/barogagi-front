import { useQuery } from "@tanstack/react-query";
import HomeContentsSection from "@/components/main/home/HomeContentsSection";
import HomeGreetingSection from "@/components/main/home/HomeGreetingSection";
import { getScheduleList } from "@/api/queries";
import { scheduleKeys } from "@/api/keyFactories";
import type { ScheduleRegistResDTO } from "@/api/types";

const HomePage = () => {
  const { data, isLoading } = useQuery({
    queryKey: scheduleKeys.lists(),
    queryFn: getScheduleList,
  });

  const raw = data?.data;
  const schedules: ScheduleRegistResDTO[] = Array.isArray(raw) ? raw : [];

  return (
    <div className="flex flex-col h-full">
      <HomeGreetingSection />
      <HomeContentsSection schedules={schedules} isLoading={isLoading} />
    </div>
  );
};

export default HomePage;
