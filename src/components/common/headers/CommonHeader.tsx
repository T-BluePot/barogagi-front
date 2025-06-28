import { UserIcon } from "@heroicons/react/20/solid";

interface CommonHeaderProps {
  onClick: () => void;
}

export const CommonHeader = ({ onClick }: CommonHeaderProps) => {
  return (
    <header className="flex px-6 w-screen h-[60px] items-center gap-6 select-none">
      <div className="flex h-9 w-9 rounded-full justify-center items-baseline-last bg-main-dark">
        <UserIcon
          className="h-8 w-8 text-gray-white cursor-pointer"
          onClick={onClick}
        />
      </div>
    </header>
  );
};
