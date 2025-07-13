import type { ModalContentsType } from "@/types/modalTypes";

const CommonModalContent = ({ title, content }: ModalContentsType) => {
  return (
    <div className="mx-4">
      <h1 className="typo-subtitle text-gray-black pb-3 pt-4 ">{title}</h1>
      <p className="typo-caption text-gray-50 pb-3 ">{content}</p>
    </div>
  );
};

export default CommonModalContent;
