import { useQuery } from "@tanstack/react-query";
import HomeContentsSection from "@/components/main/home/HomeContentsSection";
import HomeGreetingSection from "@/components/main/home/HomeGreetingSection";
import { getMySchedulesSummary, getPopularTags } from "@/api/queries";
import { homeKeys } from "@/api/keyFactories";
import type { TagInfoDTO } from "@/api/types";

const HomePage = () => {
  const { data: scheduleData, isLoading: isScheduleLoading } = useQuery({
    queryKey: homeKeys.mySchedules(),
    queryFn: getMySchedulesSummary,
  });

  const { data: tagsData, isLoading: isTagsLoading } = useQuery({
    queryKey: homeKeys.popularTags(),
    queryFn: getPopularTags,
  });

  const popularTags: TagInfoDTO[] = tagsData?.tagInfoList ?? [];

  return (
    <div className="flex flex-col h-full">
      <HomeGreetingSection />
      <HomeContentsSection
        scheduleData={scheduleData ?? null}
        isScheduleLoading={isScheduleLoading}
        popularTags={popularTags}
        isTagsLoading={isTagsLoading}
      />
    </div>
  );
};

export default HomePage;
