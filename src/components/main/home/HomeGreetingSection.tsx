import {
  HOME_GREETING,
  HOME_GREETING_SUB,
} from "@/constants/texts/main/home/headerText";

interface Props {
  userName?: string;
  hasUpcomingSchedule: boolean;
  popularRegionName?: string;
  isLoading?: boolean;
}

/**
 * 홈 인사말 섹션 (화이트 배경)
 * - 타이틀 24px 700, 강조 구간만 코랄(#E96A47)
 */
const HomeGreetingSection = ({
  userName,
  hasUpcomingSchedule,
  popularRegionName,
  isLoading,
}: Props) => {
  const { lead, highlight, tail } = HOME_GREETING({
    userName: userName ?? "핏플",
    hasUpcomingSchedule,
    popularRegionName,
    isLoading,
  });

  return (
    <section className="w-full bg-white px-5.5 text-left">
      <h1 className="text-2xl font-bold leading-[1.28] tracking-[-0.03em] whitespace-pre-line text-gray-black">
        {lead}
        {highlight && <span className="text-peach-text">{highlight}</span>}
        {tail}
      </h1>
      <p className="mt-2 mb-4 text-[13px] font-medium tracking-[-0.02em] text-gray-50">
        {HOME_GREETING_SUB}
      </p>
    </section>
  );
};

export default HomeGreetingSection;
