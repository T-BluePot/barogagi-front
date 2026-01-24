import { ChevronRightIcon } from "@heroicons/react/24/solid";
import type { ProfileMenuItemProps } from "@/types/profileTypes";

const ProfileMenuItem = ({ label, onClick }: ProfileMenuItemProps) => {
  return (
    <button
      type="button"
      className="flex w-full px-6 py-4 justify-between"
      onClick={onClick}
    >
      <span className="typo-body text-gray-black">{label}</span>
      <ChevronRightIcon className="w-5 h-5 text-gray-400" />
    </button>
  );
};

export default ProfileMenuItem;
