import { PageTitle } from "@/components/auth/common/PageTitle";
import { HOME_GREETING } from "@/constants/texts/main/home/headerText";

interface Props {
  userName?: string;
}

const HomeGreetingSection = ({ userName }: Props) => {
  return (
    <div className="flex flex-col w-full px-6 items-baseline bg-gray-black">
      <PageTitle type="home" title={HOME_GREETING(userName ?? "바로가기")} />
    </div>
  );
};

export default HomeGreetingSection;
