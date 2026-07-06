import Button from "@/components/common/buttons/CommonButton";
import TextButton from "@/components/common/buttons/TextButton";

import { ROUTES_CREATE_TEXT } from "@/constants/texts/main/plan/routesCreate";

interface FooterProps {
  onConfirm: () => void;
  onRegenerate: () => void;
  keptCount: number;
}

const RoutesCreateFooter = ({
  onConfirm,
  onRegenerate,
  keptCount,
}: FooterProps) => {
  return (
    <>
      <div className="h-2 bg-gradient-to-b from-gray-white/0 to-gray-white" />
      <div className="flex flex-col w-full gap-2 p-6 pt-2 bg-gray-white">
        <p className="text-center typo-caption text-gray-40">
          {keptCount > 0
            ? ROUTES_CREATE_TEXT.FOOTER_KEPT_NOTICE.KEPT(keptCount)
            : ROUTES_CREATE_TEXT.FOOTER_KEPT_NOTICE.EMPTY}
        </p>
        <div className="flex items-center gap-2">
          <TextButton
            label={ROUTES_CREATE_TEXT.FOOTER_REGENERATE_LABEL}
            onClick={onRegenerate}
            variant="main"
          />
          <div className="flex-1">
            <Button
              label={ROUTES_CREATE_TEXT.FOOTER_BUTTON_LABEL}
              onClick={onConfirm}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RoutesCreateFooter;
