import { COMMON_TEXT } from "@/constants/texts/main/common";

const EmptyStateSection = () => {
  return (
    <div className="flex justify-center mt-4">
      <p className="typo-body text-gray-40 text-center">
        {COMMON_TEXT.EMPTY_STATE}
      </p>
    </div>
  );
};

export default EmptyStateSection;
