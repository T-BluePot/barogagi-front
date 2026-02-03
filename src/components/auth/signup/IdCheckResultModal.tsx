import CommonAlertModal from "@/components/common/modal/common-modal/CommonAlertModal";

interface IdCheckResultModalProps {
  isOpen: boolean;
  onClick?: () => void; // 버튼 클릭 핸들러
  message: string;
}

const IdCheckResultModal = ({
  isOpen,
  onClick,
  message,
}: IdCheckResultModalProps) => {
  return (
    <CommonAlertModal
      isOpen={isOpen}
      buttonInfo={{
        label: "확인",
        onClick: onClick,
      }}
      modalContent={{
        title: "아이디 중복 확인",
        content: message,
      }}
    />
  );
};

export default IdCheckResultModal;
