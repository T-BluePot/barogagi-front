import type { ReactNode } from "react";

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
}

/**
 * 설정 화면의 카드형 섹션
 * - 프로필 메뉴 섹션과 동일한 흰색 카드 스타일을 사용해 디자인 일관성 유지
 */
const SettingsSection = ({ title, children }: SettingsSectionProps) => {
  return (
    <section className="mx-6 mt-2 py-2 bg-white rounded-xl shadow-sm">
      <h2 className="typo-subtitle text-gray-black px-6 py-4 select-none text-left">
        {title}
      </h2>
      <div className="flex flex-col">{children}</div>
    </section>
  );
};

export default SettingsSection;
