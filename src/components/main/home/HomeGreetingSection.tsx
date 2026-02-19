import { PageTitle } from "@/components/auth/common/PageTitle";
import { HOME_GREETING } from "@/constants/texts/main/home/headerText";

const HomeGreetingSection = () => {
  // TODO: auth 컨텍스트 또는 사용자 정보 API에서 실제 사용자 이름을 가져와야 합니다.
  const userName = "홍길동";
  return (
    <div className="flex flex-col w-full px-6 items-baseline bg-gray-black">
      <PageTitle type="home" title={HOME_GREETING(userName)} />
    </div>
  );
};

export default HomeGreetingSection;
