import type { ProfileMenuSectionProps } from "@/types/profileTypes";

const ProfileMenuSection = ({ title, children }: ProfileMenuSectionProps) => {
  return (
    <div className="mx-6 mt-2 py-2 bg-white rounded-xl shadow-sm">
      <h3 className="typo-subtitle text-gray-black px-6 py-4 select-none text-left">
        {title}
      </h3>
      <div className="flex flex-col">{children}</div>
    </div>
  );
};

export default ProfileMenuSection;
