import { PageTitle } from "@/components/auth/common/PageTitle";
import { HOME_GREETING } from "@/constants/texts/main/home/headerText";

const HomeGreetingSection = () => {
  const userName = "홍길동";
  return (
    <div className="flex flex-col w-full px-6 items-baseline">
      <PageTitle type="home" title={HOME_GREETING(userName)} />
    </div>
  );
};

export default HomeGreetingSection;
