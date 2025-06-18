import { UserCircleIcon } from "@heroicons/react/20/solid";

interface CommonHeaderProps {
  onClick: () => void;
}

export const CommonHeader = ({ onClick }: CommonHeaderProps) => {
  return (
    <header className="flex w-screen h-header items-center px-screen gap-lg">
      <UserCircleIcon
        className="h-9 w-9 text-main-dark cursor-pointer"
        onClick={onClick}
      />
    </header>
  );
};
