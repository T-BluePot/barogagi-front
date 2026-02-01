import type { ProfileMenuItemProps } from "@/types/profileTypes";
import IconBox from "@/components/common/IconBox";

const ProfileMenuItem = ({ label, onClick }: ProfileMenuItemProps) => {
  return (
    <button
      type="button"
      className="flex w-full px-6 py-4 justify-between"
      onClick={onClick}
    >
      <span className="typo-body text-gray-black">{label}</span>
      <IconBox
        name="arrow_forward_ios"
        width={16}
        weight={100}
        className="w-5 h-5 text-gray-400"
      />
    </button>
  );
};

export default ProfileMenuItem;
