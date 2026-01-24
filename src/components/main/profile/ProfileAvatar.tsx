import { UserIcon } from "@heroicons/react/20/solid";

const ProfileAvatar = () => {
  return (
    <div className="flex h-15 w-15 aspect-square rounded-full justify-center items-baseline-last bg-main">
      {/* TODO: 추후 프로필 이미지 업로드 기능 구현 시, 이미지가 있으면 이미지 표시, 없으면 아래 아이콘 표시 */}
      <UserIcon className="h-[90%] w-full text-main-disable cursor-pointer shadow-xl" />
    </div>
  );
};

export default ProfileAvatar;
