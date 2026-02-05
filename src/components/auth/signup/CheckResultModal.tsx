import CommonAlertModal from "@/components/common/modal/common-modal/CommonAlertModal";

interface CheckResultModalProps {
  isOpen: boolean;
  onClick?: () => void; // 버튼 클릭 핸들러
  message: string;
}

const CheckResultModal = ({
  isOpen,
  onClick,
  message,
}: CheckResultModalProps) => {
  return (
    <CommonAlertModal
      isOpen={isOpen}
      buttonInfo={{
        label: "확인",
        onClick: onClick,
      }}
      modalContent={{
        title: "확인 결과",
        content: message,
      }}
    />
  );
};

export default CheckResultModal;
