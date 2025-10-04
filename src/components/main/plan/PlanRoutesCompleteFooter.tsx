import TextButton from "@/components/common/buttons/TextButton";
import Button from "@/components/common/buttons/CommonButton";

interface FooterProps {
  handleRegenerate: () => void;
  handleConfirm: () => void;
}

const PlanRoutesCompleteFooter = ({
  handleRegenerate,
  handleConfirm,
}: FooterProps) => {
  return (
    <>
      <div className="h-5 bg-gradient-to-b from-gray-white/0 to-gray-white" />
      <div className="flex flex-row w-full p-6 gap-4 items-center bg-gray-white">
        <TextButton
          label="다시 생성하기"
          className="shrink-0"
          onClick={handleRegenerate}
        />
        <Button label="일정 생성하기" onClick={handleConfirm} />
      </div>
    </>
  );
};

export default PlanRoutesCompleteFooter;
