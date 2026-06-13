import { PageTitle } from "@/components/auth/common/PageTitle";
import { HOME_GREETING } from "@/constants/texts/main/home/headerText";

interface Props {
  userName?: string;
  hasUpcomingSchedule: boolean;
  popularRegionName?: string;
  isLoading?: boolean;
}

const HomeGreetingSection = ({
  userName,
  hasUpcomingSchedule,
  popularRegionName,
  isLoading,
}: Props) => {
  return (
    <div className="flex flex-col w-full px-6 items-baseline bg-gray-black">
      <PageTitle
        type="home"
        title={HOME_GREETING({
          userName: userName ?? "핏플",
          hasUpcomingSchedule,
          popularRegionName,
          isLoading,
        })}
      />
    </div>
  );
};

export default HomeGreetingSection;
