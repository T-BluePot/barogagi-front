import Button from "@/components/common/buttons/CommonButton";

import { ROUTES_CREATE_TEXT } from "@/constants/texts/main/plan/routesCreate";

interface FooterProps {
  onConfirm: () => void;
}

const RoutesCreateFooter = ({ onConfirm }: FooterProps) => {
  return (
    <>
      <div className="h-2 bg-gradient-to-b from-gray-white/0 to-gray-white" />
      <div className="flex flex-row w-full p-6 justify-between items-center bg-gray-white">
        <Button
          label={ROUTES_CREATE_TEXT.FOOTER_BUTTON_LABEL}
          onClick={onConfirm}
        />
      </div>
    </>
  );
};

export default RoutesCreateFooter;
