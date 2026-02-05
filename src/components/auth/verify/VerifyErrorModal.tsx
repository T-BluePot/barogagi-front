import CommonAlertModal from "@/components/common/modal/common-modal/CommonAlertModal";

interface VerifyErrorModalProps {
  isOpen: boolean;
  onClick?: () => void; // 버튼 클릭 핸들러
  message: string;
}

const VerifyErrorModal = ({
  isOpen,
  onClick,
  message,
}: VerifyErrorModalProps) => {
  return (
    <CommonAlertModal
      isOpen={isOpen}
      buttonInfo={{
        label: "확인",
        onClick: onClick,
      }}
      modalContent={{
        title: "인증에 문제가 발생했습니다",
        content: message,
      }}
    />
  );
};

export default VerifyErrorModal;
