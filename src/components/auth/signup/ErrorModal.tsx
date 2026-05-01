import CommonAlertModal from "@/components/common/modal/common-modal/CommonAlertModal";

interface ErrorModalProps {
  isOpen: boolean;
  onClick?: () => void; // 버튼 클릭 핸들러
  message: string;
}

const ErrorModal = ({ isOpen, onClick, message }: ErrorModalProps) => {
  return (
    <CommonAlertModal
      isOpen={isOpen}
      buttonInfo={{
        label: "확인",
        onClick: onClick,
      }}
      modalContent={{
        title: "오류",
        content: message,
      }}
    />
  );
};

export default ErrorModal;
