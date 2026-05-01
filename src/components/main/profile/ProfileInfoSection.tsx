import { useNavigate } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { ROUTES } from "@/constants/routes";
import ProfileAvatar from "./ProfileAvatar";
import ProfileUserInfo from "./ProfileUserInfo";

interface ProfileInfoSectionProps {
  nickname: string;
  userId: string;
}

const ProfileInfoSection = ({ nickname, userId }: ProfileInfoSectionProps) => {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate(ROUTES.MAIN.PROFILE_EDIT);
  };

  return (
    <section
      className="flex w-full items-center px-6 py-8 gap-4 cursor-pointer hover:bg-white/5 transition-colors"
      onClick={handleEditProfile}
    >
      <ProfileAvatar />
      <div className="flex-1 overflow-hidden ">
        <ProfileUserInfo nickname={nickname} userId={userId} />
      </div>
      <ChevronRightIcon className="w-6 h-6 text-gray-500 shrink-0" />
    </section>
  );
};

export default ProfileInfoSection;
